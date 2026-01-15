import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, price } = await request.json();

        if (!title || !description || price === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user has enough credits to offer this reward?
        // According to requirements: "Deduct credits from the task creator's balance... When a user completes a task"
        // Wait, usually marketplaces deduct on creation (escrow) OR deduct on completion.
        // Requirement says: "When a user completes a task: Deduct credits from the task creator's balance"
        // This implies deduction happens LATER. But this risks the creator running out of credits by the time it's completed.
        // However, I will follow the specific instruction: "When a user completes a task: Deduct credits..."
        // Ideally we should check if they currently have enough to post it, or warn them.
        // Let's at least check if they have enough now.

        const user = await User.findById(session.user.id);
        if (!user || user.credits < price) {
            return NextResponse.json({ error: 'Insufficient credits to post this task reward' }, { status: 400 });
        }

        const newTask = await Task.create({
            title,
            description,
            price: Number(price),
            creatorId: session.user.id,
            status: 'open',
        });

        return NextResponse.json({ success: true, task: newTask });

    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        await dbConnect();

        // Fetch tasks that are open OR tasks assigned to current user OR created by current user
        // Actually "Display all available tasks submitted by other users" implies open tasks.

        const tasks = await Task.find()
            .populate('creatorId', 'name department')
            .populate('assigneeId', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({ tasks, userId: session?.user?.id });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}
