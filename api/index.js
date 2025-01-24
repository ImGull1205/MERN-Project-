const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place');
const BookingModel = require('./models/Booking');
const Review = require('./models/Review.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const cloudinary = require('./cloudinaryConfig');
const path = require('path');
const imageDownloader = require('image-downloader');



require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET 
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
}));

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.get('/api/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: 'Unauthorized' });
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const {token} = req.cookies;
    if (!token) {
      reject(new Error('No token provided'));
      return;
    }
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
}

async function uploadToCloudinary(filePath, originalFilename, mimeType) {
  const fileStream = fs.createReadStream(filePath);
  const ext = path.extname(originalFilename);
  const newFilename = `${Date.now()}${ext}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: newFilename, 
      resource_type: 'auto',   
      folder: 'uploads/',     
      use_filename: true,      
      unique_filename: false, 
    });

    
    const directImageLink = result.secure_url; 
    return directImageLink;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
}


app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) return res.status(500).json({ message: 'Error generating token' });
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('Password not correct');
    }
  } else {
    res.status(404).json('User not found');
  }
});

app.post('/api/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/api/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: '/tmp/' + newName,
  });
  const url = await uploadToCloudinary('/tmp/' + newName, newName, 'image/jpeg');
  res.json({ url });
});

const photosMiddleware = multer({ dest: '/tmp' });

app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToCloudinary(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post('/api/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    title, addedPhotos, description, features, tickets,
    province, district, street, houseNumber
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        photos: addedPhotos,
        description,
        features,
        tickets,
        location: { province, district, street, houseNumber },
      });
      res.json(placeDoc);
    } catch (error) {
      res.status(500).json({ message: 'Error creating place', error: error.message });
    }
  });
});

app.get('/api/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/api/places/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const reviews = await Review.find({ place: id }).populate('user', 'name email'); 
    res.json({ place, reviews });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

app.put('/api/places', async (req, res) => {
  const { token } = req.cookies;
  try {
    console.log('Request body:', req.body); // Thêm log để debug
    const {
      id, title, photos, description,
      features, tickets, province, district, street, houseNumber
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ message: 'Unauthorized' });

      try {
        const placeDoc = await Place.findById(id);
        if (!placeDoc) {
          return res.status(404).json({ message: 'Place not found' });
        }

        if (userData.id === placeDoc.owner.toString()) {
          placeDoc.set({
            title,
            photos,
            description,
            features,
            tickets,
            location: { province, district, street, houseNumber },
          });

          await placeDoc.save();
          res.json({ message: 'Place updated successfully', placeDoc });
        } else {
          res.status(403).json({ message: 'Not authorized to update this place' });
        }
      } catch (error) {
        console.error('Detailed error:', error); // Thêm log để debug
        res.status(500).json({ message: 'Error updating place', error: error.message });
      }
    });
  } catch (error) {
    console.error('Request error:', error); // Thêm log để debug
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/places', async (req, res) => {
  try {
    const {
      province,
      district,
      street,
      features,
      tickets,
      priceMin,
      priceMax
    } = req.query;

    // Build query for Place model
    const query = {};

    if (province) query['location.province'] = { $regex: new RegExp(province, 'i') };
    if (district) query['location.district'] = { $regex: new RegExp(district, 'i') };
    if (street) query['location.street'] = { $regex: new RegExp(street, 'i') };

    if (features) {
      const featuresArray = features.split(',');
      query.features = { $in: featuresArray.map(feature => new RegExp(feature, 'i')) };
    }

    // Fetch places that match the location and features criteria, or return all if no criteria provided
    const places = await Place.find(query);

    // If no ticket or price filters, return places directly
    if (!priceMin && !priceMax && !tickets) {
      return res.json(places);
    }

    // Filter tickets based on type and price
    const filteredPlaces = places.filter(place => {
      if (!place.tickets) return false;

      return place.tickets.some(ticket => {
        // Normalize ticket type to lowercase for case-insensitive matching
        const ticketType = ticket.type.toLowerCase();
        const targetType = tickets?.toLowerCase(); // Normalize search ticket type
        
        const price = ticket.price;
        const matchesType = !tickets || (ticketType === targetType);
        const matchesPrice = (!priceMin || price >= parseInt(priceMin)) && 
                             (!priceMax || price <= parseInt(priceMax));
                             
        return matchesType && matchesPrice;
      });
    });

    res.json(filteredPlaces);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'An error occurred while fetching places.' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { token } = req.cookies;
  const { placeId, point,comment } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const userId = userData.id;

      const placeDoc = await Place.findById(placeId);
      if (!placeDoc) return res.status(404).json({ message: 'Place not found' });

      const existingReview = await Review.findOne({ user: userId, place: placeId });

      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this place.' });
      } else {
        const newReview = await Review.create({
          user: userId,
          place: placeId,
          point: point,
          comment: comment
        });

        res.status(201).json(newReview);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error posting review', error: error.message });
    }
  });
});

app.put('/api/reviews', async (req, res) => {
  const { token } = req.cookies;
  const { placeId, point,comment } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const userId = userData.id;

      const placeDoc = await Place.findById(placeId);
      if (!placeDoc) return res.status(404).json({ message: 'Place not found' });

      const existingReview = await Review.findOne({ user: userId, place: placeId });

      if (!existingReview) {
        return res.status(404).json({ message: 'Review not found for this place' });
      } else {
        existingReview.point = point;
        existingReview.comment = comment;
        await existingReview.save();

        res.json(existingReview);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error modifying review', error: error.message });
    }
  });
});

app.post('/api/bookings', async (req, res) => {
  const { token } = req.cookies;
  const { placeId, activationDate, selectedTickets } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const userId = userData.id;

      const placeDoc = await Place.findById(placeId);
      if (!placeDoc) return res.status(404).json({ message: 'Place not found' });

      const tickets = selectedTickets.map(selectedTicket => {
        const matchingTicket = placeDoc.tickets.find(ticket => ticket.type === selectedTicket.type);
        if (!matchingTicket) {
          throw new Error(`Ticket type ${selectedTicket.type} not available for this place`);
        }
        return {
          type: matchingTicket.type,
          quantity: selectedTicket.quantity,
          price: matchingTicket.price * selectedTicket.quantity,
        };
      });

      const totalPrice = tickets.reduce((total, ticket) => total + ticket.price, 0);

      const bookingDoc = await BookingModel.create({
        user: userId,
        place: placeId,
        activationDate: new Date(activationDate),
        tickets: tickets.map(ticket => ({ type: ticket.type, quantity: ticket.quantity })),
        totalPrice,
      });

      res.json(bookingDoc);
    } catch (error) {
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  });
});



app.get('/api/bookings', async (req,res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await BookingModel.find({user:userData.id}).populate('place');
    res.json(bookings);
  } catch (err) {
    res.status(401).json({error: 'Unauthorized'});
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const userData = await getUserDataFromReq(req);
  
  try {
    const booking = await BookingModel.findById(id);
    if (booking.user.toString() !== userData.id) {
      return res.status(403).json({error: 'Not your booking'});
    }
    await BookingModel.findByIdAndDelete(id);
    res.json({message: 'Booking deleted'});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
