import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  role: 'user' | 'admin';
  accounts: {
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
