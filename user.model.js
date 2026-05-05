const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type:   String,
      unique:  true,
      sparse:  true,   // allows null for non-OAuth accounts
    },
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    phone: {
      type:    String,
      trim:    true,
      default: null,
    },
    location: {
      city:    { type: String, trim: true, default: null },
      state:   { type: String, trim: true, default: null },
      country: { type: String, trim: true, default: null },
    },
    avatar: {
      type:    String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
