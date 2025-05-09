const mongoose = require('mongoose');

const ContentSuggestionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      enum: ['instagram', 'twitter', 'facebook', 'linkedin', 'all'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'carousel', 'text'],
      required: true,
    },
    suggestedTags: [{
      type: String,
    }],
    bestTimeToPost: {
      type: Date,
      required: true,
    },
    aiGeneratedScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'published'],
      default: 'pending',
    },
    engagement: {
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
    },
  },
  {
    timestamps: true,
  }
);

// Create index for userId and status
ContentSuggestionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('ContentSuggestion', ContentSuggestionSchema);
