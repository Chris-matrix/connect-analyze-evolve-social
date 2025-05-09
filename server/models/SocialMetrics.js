const mongoose = require('mongoose');

const SocialMetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'facebook', 'linkedin'],
      required: true,
    },
    metrics: {
      followers: {
        type: Number,
        default: 0,
      },
      following: {
        type: Number,
        default: 0,
      },
      posts: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      impressions: {
        type: Number,
        default: 0,
      },
      reach: {
        type: Number,
        default: 0,
      },
      engagement: {
        type: Number,
        default: 0,
      },
    },
    dailyStats: [
      {
        date: {
          type: Date,
          required: true,
        },
        followers: {
          type: Number,
          default: 0,
        },
        engagement: {
          type: Number,
          default: 0,
        },
        impressions: {
          type: Number,
          default: 0,
        },
        reach: {
          type: Number,
          default: 0,
        },
      },
    ],
    platformAccountId: {
      type: String,
      required: true,
    },
    platformUsername: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for userId and platform
SocialMetricsSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SocialMetrics', SocialMetricsSchema);
