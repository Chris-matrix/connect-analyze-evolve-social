const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    image: String,
    emailVerified: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    accounts: [
      {
        provider: {
          type: String,
          required: true,
        },
        providerAccountId: {
          type: String,
          required: true,
        },
        access_token: String,
        refresh_token: String,
        expires_at: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a compound index on provider and providerAccountId
UserSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });

module.exports = mongoose.model('User', UserSchema);
