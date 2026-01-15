import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import mongoose from 'mongoose';

// Apply for a task
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

        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        if (task.status !== 'open') {
            return NextResponse.json({ error: 'Task is no longer open' }, { status: 400 });
        }

        if (task.creatorId.toString() === session.user.id) {
            return NextResponse.json({ error: 'You cannot apply for your own task' }, { status: 400 });
        }

        // Assign the task
        task.assigneeId = new mongoose.Types.ObjectId(session.user.id);
        task.status = 'in_progress';
        await task.save();

        return NextResponse.json({ success: true, message: 'Application successful' });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to apply for task' }, { status: 500 });
    }
}
