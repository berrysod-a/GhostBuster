import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    phone: string;
    name: string;
    department: string;
    className: string;
    credits: number;
    isAdmin: boolean;
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            default: '',
        },
        department: {
            type: String,
            default: '',
        },
        className: {
            type: String,
            default: '',
        },
        credits: {
            type: Number,
            default: 50,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
