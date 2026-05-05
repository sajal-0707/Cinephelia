const mongoose = require('mongoose');
const Movie   = require('../models/movie.model');
const Booking = require('../models/booking.model');

/**
 * POST /api/bookings
 * Body: { movieId, showtimeId, seats: ["A1","A2"] }
 *
 * Uses a findOneAndUpdate with $addToSet semantics guarded by a $not/$in check
 * so two simultaneous requests cannot book the same seat.
 */
exports.createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { movieId, showtimeId, seats } = req.body;

    if (!movieId || !showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'movieId, showtimeId, and seats[] are required' });
    }

    // Validate seat format (e.g. A1 – J10)
    const SEAT_PATTERN = /^[A-J]([1-9]|10)$/;
    const invalid = seats.filter((s) => !SEAT_PATTERN.test(s));
    if (invalid.length) {
      return res.status(400).json({ success: false, message: `Invalid seat(s): ${invalid.join(', ')}` });
    }

    // Atomically reserve seats: only succeed if NONE of the requested seats are already booked
    const updated = await Movie.findOneAndUpdate(
      {
        _id:   movieId,
        'showtimes._id': showtimeId,
        // Ensure none of the requested seats are in bookedSeats
        'showtimes': {
          $elemMatch: {
            _id: showtimeId,
            bookedSeats: { $not: { $elemMatch: { $in: seats } } },
          },
        },
      },
      {
        $push: { 'showtimes.$.bookedSeats': { $each: seats } },
      },
      { new: true, session }
    );

    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: 'One or more seats are already booked. Please choose different seats.',
      });
    }

    const showtime = updated.showtimes.id(showtimeId);

    // Check capacity hasn't been exceeded
    if (showtime.bookedSeats.length > showtime.totalSeats) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ success: false, message: 'Not enough seats available' });
    }

    const totalAmount = seats.length * showtime.ticketPrice;

    const booking = await Booking.create(
      [{
        user:    req.user._id,
        movie:   movieId,
        showtimeId,
        showtimeSnapshot: {
          date:        showtime.date,
          time:        showtime.time,
          hall:        showtime.hall,
          ticketPrice: showtime.ticketPrice,
        },
        seats,
        totalAmount,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Populate movie title for the confirmation response
    const populated = await Booking.findById(booking[0]._id)
      .populate('movie', 'title posterUrl')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: populated,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

/**
 * GET /api/bookings/:bookingId
 * bookingId is the human-friendly "BK-XXXXXXXX" string.
 */
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
      user:      req.user._id,
    })
      .populate('movie', 'title posterUrl duration language')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (err) { next(err); }
};

/**
 * POST /api/bookings/:bookingId/cancel
 * Releases the seats back to the showtime and marks the booking cancelled.
 */
exports.cancelBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.bookingId,
      user:      req.user._id,
    }).session(session);

    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Release seats
    await Movie.findOneAndUpdate(
      { 'showtimes._id': booking.showtimeId },
      { $pullAll: { 'showtimes.$.bookedSeats': booking.seats } },
      { session }
    );

    booking.status      = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
