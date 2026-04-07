const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add password'],
      minlength: 6,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
    },
    role: {
      type: String,
      enum: ['admin', 'provider', 'customer'],
      default: 'customer',
      required: true,
    },
    address: {
      type: String,
      required: [true, 'Please add address'],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);