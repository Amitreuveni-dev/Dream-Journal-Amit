import { Schema, model, Document } from "mongoose";


export interface User extends Document {
    name: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {timestamps: true});

export const userModel = model<User>("User", userSchema)