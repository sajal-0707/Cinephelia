const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/payment.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.post('/create-order', isAuthenticated, createOrder);
router.post('/verify', isAuthenticated, verifyPayment);

module.exports = router;