import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type TransactionType = 'welcome_bonus' | 'class_purchase' | 'class_sale' | 'task_payment' | 'task_earning';

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    type: TransactionType;
    amount: number;
    description: string;
    relatedId?: Types.ObjectId;
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['welcome_bonus', 'class_purchase', 'class_sale', 'task_payment', 'task_earning'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        relatedId: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
