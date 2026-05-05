const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * GET /api/auth/google
 * Redirects the browser to Google's consent screen.
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * GET /api/auth/google/callback
 * Google redirects here after the user grants/denies permission.
 */
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // Successful auth — redirect to the frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

/**
 * GET /api/auth/me
 * Returns the currently logged-in user (or 401).
 */
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  res.json({ success: true, user: req.user });
});

/**
 * POST /api/auth/logout
 * Destroys the session.
 */
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
