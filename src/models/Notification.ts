import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type NotificationType = 'info' | 'success' | 'warning';

export interface INotification extends Document {
    userId: Types.ObjectId;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning'],
            default: 'info',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
