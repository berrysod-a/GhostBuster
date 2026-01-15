import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { name, department, className } = data;

        if (!name || !department || !className) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Check if user is already onboarded to prevent double dipping on welcome bonus
        const existingUser = await User.findById(session.user.id);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isFirstTime = !existingUser.isOnboarded;

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                name,
                department,
                className,
                isOnboarded: true,
            },
            { new: true }
        );

        // If first time onboarding, record the welcome bonus transaction
        // Note: The credit amount (50) was already set in the User model default or create
        // This transaction record is just for history transparency
        if (isFirstTime) {
            await Transaction.create({
                userId: session.user.id,
                type: 'welcome_bonus',
                amount: 50,
                description: 'Welcome bonus for joining UniCredit!',
            });
        }

        return NextResponse.json({
            success: true,
            user: updatedUser,
            isFirstTime
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
