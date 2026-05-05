const express = require('express');
const router  = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

// All user routes require a logged-in session
router.use(isAuthenticated);

router.get('/profile',        userController.getProfile);
router.put('/profile',        userController.updateProfile);
router.get('/bookings',       userController.getMyBookings);

module.exports = router;
