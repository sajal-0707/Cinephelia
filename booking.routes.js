const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const bookingController = require('../controllers/booking.controller');

router.use(isAuthenticated);

router.post('/',          bookingController.createBooking);
router.get('/:bookingId', bookingController.getBooking);
router.post('/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;
