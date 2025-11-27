import { Schema, model, Document, Types } from "mongoose";

export interface Dream extends Document {
    userId: Types.ObjectId;
    title: string;
    content: string;
    date?: Date;
    clarity: number;
    mood?: "happy" | "sad" | "scared" | "confused" | "peaceful" | "anxious" | "excited" | "neutral";
    tags?: string[];
    isFavorite: boolean
    createdAt?: Date;
    updatedAt?: Date;
}

const dreamSchema = new Schema<Dream>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    clarity: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    mood: {
        type: String,
        enum: [
            'happy', 'sad', 'scared', 'confused',
            'peaceful', 'anxious', 'excited', 'neutral'
        ]
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    isFavorite: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


export const DreamModel = model<Dream>("Dream", dreamSchema);
