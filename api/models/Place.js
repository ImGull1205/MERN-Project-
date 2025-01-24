const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: String },
  tickets: [{
    type: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  photos: { type: [String] },
  location: {
    province: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: String, required: true }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
