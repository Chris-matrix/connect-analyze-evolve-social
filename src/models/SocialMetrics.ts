import mongoose, { Document, Schema } from 'mongoose';

export type PlatformType = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';

export interface ISocialMetrics extends Document {
  userId: mongoose.Types.ObjectId;
  platform: PlatformType;
  metrics: {
    followers: number;
    following?: number;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    reach: number;
    engagement: number;
  };
  dailyStats: {
    date: Date;
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
  }[];
  platformAccountId: string;
  platformUsername: string;
  lastUpdated: Date;
}

const SocialMetricsSchema = new Schema<ISocialMetrics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

export default mongoose.models.SocialMetrics || mongoose.model<ISocialMetrics>('SocialMetrics', SocialMetricsSchema);
