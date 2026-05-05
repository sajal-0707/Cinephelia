const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  date:      { type: Date,   required: true },
  time:      { type: String, required: true },  // e.g. "18:30"
  hall:      { type: String, required: true },  // e.g. "Hall A"
  totalSeats:{ type: Number, required: true, default: 100 },
  // Flat list of booked seat labels e.g. ["A1","A2","B5"]
  bookedSeats: { type: [String], default: [] },
  ticketPrice: { type: Number, required: true },
});

const movieSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre:       { type: [String], default: [] },
    language:    { type: String, default: 'English' },
    duration:    { type: Number, required: true },   // minutes
    releaseDate: { type: Date },
    rating:      { type: Number, min: 0, max: 10, default: 0 },
    posterUrl:   { type: String, default: null },
    cast:        { type: [String], default: [] },
    director:    { type: String, default: null },
    showtimes:   [showtimeSchema],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
