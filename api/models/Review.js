const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true }, // Reference to the Place model
  comment: { type: String, required: true}, 
  point: { type: Number, required: true, min: 0, max: 5 }, // Point is required and constrained between 0 and 5
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
