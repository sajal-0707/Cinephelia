const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type:    String,
      unique:  true,
      default: () => `BK-${uuidv4().slice(0, 8).toUpperCase()}`,
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    movie: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Movie',
      required: true,
    },
    showtimeId: {
      type:     mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Snapshot of showtime details at booking time
    showtimeSnapshot: {
      date:        Date,
      time:        String,
      hall:        String,
      ticketPrice: Number,
    },
    seats:         { type: [String], required: true }, // e.g. ["A1","A2"]
    totalAmount:   { type: Number,   required: true },
    status: {
      type:    String,
      enum:    ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
