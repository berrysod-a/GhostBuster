import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

// Complete a task (Called by Creator to verify and pay, OR by system? 
// Requirement says: "When a user completes a task... Deduct credits". 
// Usually the assignee marks as done, then creator approves. 
// Simplying for MVP: Creator marks as completed/approves completion to release funds.
// OR Assignee marks completed and it auto-pays? 
// Safer: Creator clicks "Mark Completed & Pay"
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Start session
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            const task = await Task.findById(id).session(dbSession);
            if (!task) throw new Error('Task not found');

            // Only creator can mark as completed/pay? 
            // Let's assume the Creator verifies the work and clicks "Complete & Pay"
            if (task.creatorId.toString() !== session.user.id) {
                throw new Error('Only the task creator can mark this as completed');
            }

            if (task.status !== 'in_progress') {
                throw new Error('Task is not in progress');
            }

            if (!task.assigneeId) {
                throw new Error('No assignee found');
            }

            const creator = await User.findById(session.user.id).session(dbSession);
            const assignee = await User.findById(task.assigneeId).session(dbSession);

            if (!creator || !assignee) throw new Error('Users not found');

            // Check funds again
            if (creator.credits < task.price) {
                throw new Error('Insufficient credits to pay for this task!');
            }

            // Transfer
            creator.credits -= task.price;
            assignee.credits += task.price;

            await creator.save({ session: dbSession });
            await assignee.save({ session: dbSession });

            // Transactions
            await Transaction.create([{
                userId: creator._id,
                type: 'task_payment',
                amount: -task.price,
                description: `Paid for task: ${task.title}`,
                relatedId: task._id
            }], { session: dbSession });

            await Transaction.create([{
                userId: assignee._id,
                type: 'task_earning',
                amount: task.price,
                description: `Earned from task: ${task.title}`,
                relatedId: task._id
            }], { session: dbSession });

            // Update Status
            task.status = 'completed';
            await task.save({ session: dbSession });

            await dbSession.commitTransaction();

            return NextResponse.json({ success: true, message: 'Task completed and payment sent' });

        } catch (error: any) {
            await dbSession.abortTransaction();
            throw new Error(error.message);
        } finally {
            dbSession.endSession();
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
