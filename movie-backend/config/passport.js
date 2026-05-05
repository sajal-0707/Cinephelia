const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Try to find existing user by Google ID or email
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email = profile.emails?.[0]?.value;
          // Link account if email already exists
          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
            user.avatar   = profile.photos?.[0]?.value || user.avatar;
            await user.save();
          } else {
            // Create brand-new user
            user = await User.create({
              googleId:  profile.id,
              name:      profile.displayName,
              email,
              avatar:    profile.photos?.[0]?.value,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-__v');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
