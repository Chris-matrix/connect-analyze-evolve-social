import mongoose, { Document, Schema } from 'mongoose';

export interface IContentSuggestion extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all';
  title: string;
  content: string;
  mediaType: 'image' | 'video' | 'carousel' | 'text';
  suggestedTags: string[];
  bestTimeToPost: Date;
  aiGeneratedScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContentSuggestionSchema = new Schema<IContentSuggestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

export default mongoose.models.ContentSuggestion || 
  mongoose.model<IContentSuggestion>('ContentSuggestion', ContentSuggestionSchema);
