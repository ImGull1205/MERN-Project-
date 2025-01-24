const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  activationDate: { type: Date, required: true }, 
  tickets: [{
    type: { type: String, required: true }, 
    quantity: { type: Number, required: true } 
  }],
  totalPrice: { type: Number, required: true }, 
}, {
  timestamps: true, 
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
