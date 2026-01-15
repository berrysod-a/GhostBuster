import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth'; // Import Session type
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

export async function POST(
    request: Request,
    { params }: { params: { id: string } } // Correct type for params in Next.js 13+ route handlers
) {
    // Await params before using (Next.js 15 requirement, good practice generally)
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions) as Session | null; // Cast for explicit typing

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        await dbConnect();

        // Start a session for atomic transaction
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            // 1. Get the class
            const classItem = await Class.findById(id).session(dbSession);
            if (!classItem) {
                throw new Error('Class not found');
            }

            // Check if already purchased
            if (classItem.purchasedBy.some(id => id.toString() === userId)) {
                throw new Error('You have already purchased this class');
            }

            // Check if trying to buy own class
            if (classItem.instructorId.toString() === userId) {
                throw new Error('You cannot purchase your own class');
            }

            // 2. Get the buyer (user)
            const buyer = await User.findById(userId).session(dbSession);
            if (!buyer) throw new Error('User not found');

            // 3. Check balance
            if (buyer.credits < classItem.price) {
                throw new Error(`Insufficient credits. You need ${classItem.price} credits.`);
            }

            // 4. Get the instructor
            const instructor = await User.findById(classItem.instructorId).session(dbSession);
            if (!instructor) throw new Error('Instructor not found');

            // 5. Transfer credits
            buyer.credits -= classItem.price;
            instructor.credits += classItem.price;

            await buyer.save({ session: dbSession });
            await instructor.save({ session: dbSession });

            // 6. Record transactions
            await Transaction.create([{
                userId: buyer._id,
                type: 'class_purchase',
                amount: -classItem.price,
                description: `Purchased class: ${classItem.title}`,
                relatedId: classItem._id,
            }], { session: dbSession });

            await Transaction.create([{
                userId: instructor._id,
                type: 'class_sale',
                amount: classItem.price,
                description: `Sold class: ${classItem.title}`,
                relatedId: classItem._id,
            }], { session: dbSession });

            // 7. Update class access
            classItem.purchasedBy.push(buyer._id);
            await classItem.save({ session: dbSession });

            await dbSession.commitTransaction();

            return NextResponse.json({ success: true, message: 'Class purchased successfully' });

        } catch (error: any) {
            await dbSession.abortTransaction();
            throw new Error(error.message || 'Transaction failed');
        } finally {
            dbSession.endSession();
        }

    } catch (error: any) {
        console.error('Purchase error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
