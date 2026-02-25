import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type MoodType = 'happy' | 'sad' | 'anxious' | 'peaceful' | 'confused' | 'excited' | 'fearful' | 'neutral';

export interface IAnalysis {
  mood?: MoodType;
  symbols: string[];
  interpretation?: string;
  detectedLanguage?: string;
  analyzedAt?: Date;
}

export interface IDream {
  user: Types.ObjectId;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  isLucid: boolean;
  mood?: MoodType;
  clarity: number;
  analysis?: IAnalysis;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDreamDocument extends IDream, Document {
  softDelete(): Promise<IDreamDocument>;
  restore(): Promise<IDreamDocument>;
}

export interface IDreamModel extends Model<IDreamDocument> {
  findByUser(userId: Types.ObjectId, includeDeleted?: boolean): Promise<IDreamDocument[]>;
  findTrashed(userId: Types.ObjectId): Promise<IDreamDocument[]>;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    mood: {
      type: String,
      enum: ['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral'],
    },
    symbols: {
      type: [String],
      default: [],
    },
    interpretation: {
      type: String,
    },
    detectedLanguage: {
      type: String,
    },
    analyzedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const dreamSchema = new Schema<IDreamDocument, IDreamModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
      maxlength: [10000, 'Content must be at most 10,000 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    isLucid: {
      type: Boolean,
      default: false,
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'anxious', 'peaceful', 'confused', 'excited', 'fearful', 'neutral'],
    },
    clarity: {
      type: Number,
      min: [1, 'Clarity must be between 1 and 5'],
      max: [5, 'Clarity must be between 1 and 5'],
      default: 3,
    },
    analysis: {
      type: analysisSchema,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      index: true,
      // TTL index: automatically delete documents 30 days after deletedAt
      expires: 60 * 60 * 24 * 30, // 30 days in seconds
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Compound indexes for common queries
dreamSchema.index({ user: 1, date: -1 });
dreamSchema.index({ user: 1, isDeleted: 1, date: -1 });
dreamSchema.index({ user: 1, tags: 1 });
dreamSchema.index({ user: 1, mood: 1 });

// Text index for search functionality
dreamSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Soft delete method
dreamSchema.methods.softDelete = async function (): Promise<IDreamDocument> {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Restore from trash method
dreamSchema.methods.restore = async function (): Promise<IDreamDocument> {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return this.save();
};

// Static method to find dreams by user (excluding deleted by default)
dreamSchema.statics.findByUser = function (
  userId: Types.ObjectId,
  includeDeleted = false
) {
  const query = includeDeleted
    ? { user: userId }
    : { user: userId, isDeleted: false };
  return this.find(query).sort({ date: -1 });
};

// Static method to find trashed dreams
dreamSchema.statics.findTrashed = function (userId: Types.ObjectId) {
  return this.find({ user: userId, isDeleted: true }).sort({ deletedAt: -1 });
};

export const Dream = mongoose.model<IDreamDocument, IDreamModel>('Dream', dreamSchema);
