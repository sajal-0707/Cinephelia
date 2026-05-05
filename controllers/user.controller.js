const User    = require('../models/user.model');
const Booking = require('../models/booking.model');

/**
 * GET /api/users/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/**
 * PUT /api/users/profile
 * Body: { name, phone, location: { city, state, country } }
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'location'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true, select: '-__v' }
    );

    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/**
 * GET /api/users/bookings
 * Returns all bookings for the logged-in user.
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) { next(err); }
};
