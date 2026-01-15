import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IClass extends Document {
    title: string;
    description: string;
    price: number;
    videoUrl: string;
    thumbnailUrl: string;
    instructorId: Types.ObjectId;
    department: string;
    purchasedBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            default: '',
        },
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        department: {
            type: String,
            default: '',
        },
        purchasedBy: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true,
    }
);

const Class: Model<IClass> = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;
