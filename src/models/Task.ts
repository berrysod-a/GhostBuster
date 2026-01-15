import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type TaskStatus = 'open' | 'in_progress' | 'completed';

export interface ITask extends Document {
    title: string;
    description: string;
    price: number;
    creatorId: Types.ObjectId;
    assigneeId?: Types.ObjectId;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
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
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assigneeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'completed'],
            default: 'open',
        },
    },
    {
        timestamps: true,
    }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
