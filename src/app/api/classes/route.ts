import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, price, videoData, department } = await request.json();

        if (!title || !description || price === undefined || !videoData || !department) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Upload video to Cloudinary
        // Note: In a real app we might use signed uploads or a separate upload endpoint
        // to avoid sending large base64 strings if the file is huge
        const uploadResponse = await cloudinary.uploader.upload(videoData, {
            folder: 'unicredit/classes',
            resource_type: 'video',
        });

        await dbConnect();

        const newClass = await Class.create({
            title,
            description,
            price: Number(price),
            videoUrl: uploadResponse.secure_url,
            thumbnailUrl: uploadResponse.secure_url.replace(/\.[^/.]+$/, ".jpg"), // Simple thumbnail from video
            instructorId: session.user.id,
            department,
            purchasedBy: [], // Initially no one has purchased
        });

        return NextResponse.json({ success: true, class: newClass });

    } catch (error) {
        console.error('Error creating class:', error);
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const session = await getServerSession(authOptions);

        await dbConnect();

        const query: any = {};
        if (department) {
            query.department = department;
        }

        const classes = await Class.find(query)
            .populate('instructorId', 'name className department')
            .sort({ createdAt: -1 });

        return NextResponse.json({ classes, userId: session?.user?.id });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}
