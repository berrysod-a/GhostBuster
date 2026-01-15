'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct hook for App Router params? Actually uses useParams in client components
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CreditBalance from '@/components/CreditBalance';
import { useSession } from 'next-auth/react';

export default function ClassDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [classItem, setClassItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userCredits, setUserCredits] = useState<number>(0);

    useEffect(() => {
        // Determine if we have the class data from a previous list fetch or need to fetch individual?
        // For simplicity, let's fetch individual if the API supports it, or filter from list
        // Ideally we need a GET /api/classes/[id] endpoint. 
        // Since I implemented GET /api/classes listing, let's just stick to the listing endpoint and filter client side 
        // OR quickly add the backend logic. 
        // Actually, listing endpoint returns all, let's just filter client side for MVP or fetch all.
        // BETTER: Let's fetch the specific class. I need to make sure the API supports it or just fetch all and find.
        // My previous API route was /api/classes with department filter.
        // I should create a specific GET /api/classes/[id] implementation or just use the list for now to save time if the list is small.
        // But for correct arch, I will quickly fetch all and filter client side for this demo.

        // Fetch user credits for validation
        fetch('/api/users').then(r => r.json()).then(d => setUserCredits(d.user?.credits || 0));

        // Fetch class
        fetch('/api/classes').then(r => r.json()).then(data => {
            const found = data.classes.find((c: any) => c._id === id);
            setClassItem(found);
            setLoading(false);
        });
    }, [id]);

    const handlePurchase = async () => {
        if (!session) return;

        // Client side validation
        if (userCredits < classItem.price) {
            setError(`Insufficient credits! You need ${classItem.price - userCredits} more.`);
            return;
        }

        if (confirm(`Are you sure you want to purchase "${classItem.title}" for ${classItem.price} credits?`)) {
            setPurchasing(true);
            setError('');

            try {
                const res = await fetch(`/api/classes/${id}/purchase`, {
                    method: 'POST',
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error);

                setSuccess('Purchase successful! Unlocking video...');

                // Refresh class data to show video
                // In a real app we'd re-fetch just this class.
                // Here we just reload the page or update local state
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (err: any) {
                setError(err.message);
                setPurchasing(false);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    if (!classItem) return <div className="p-8 text-center">Class not found</div>;

    const isOwner = session?.user?.id === classItem.instructorId._id;
    const isPurchased = classItem.purchasedBy.includes(session?.user?.id);
    const canView = isOwner || isPurchased;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="container max-w-4xl mx-auto">
                <Link href="/classes/attend" className="text-muted hover:underline mb-4 inline-block">&larr; Back to Browse</Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card overflow-hidden p-0">
                            <div className="aspect-video bg-black relative flex items-center justify-center">
                                {canView ? (
                                    <video
                                        src={classItem.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        poster={classItem.thumbnailUrl}
                                    />
                                ) : (
                                    <div className="text-center p-8 text-white">
                                        <div className="text-6xl mb-4">🔒</div>
                                        <h2 className="text-xl font-bold mb-2">Locked Content</h2>
                                        <p className="opacity-80">Purchase this class to watch the video</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h1 className="heading-2 mb-2">{classItem.title}</h1>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                        {classItem.department}
                                    </span>
                                </div>

                                <p className="text-muted whitespace-pre-wrap">{classItem.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-bold mb-4 border-b pb-2">Class Details</h3>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-muted">Instructor</span>
                                <div className="font-medium flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                                        {classItem.instructorId.name?.[0]}
                                    </div>
                                    {classItem.instructorId.name}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-muted">Price</span>
                                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {classItem.price} Credits
                                </div>
                            </div>

                            {error && <div className="bg-red-50 text-red-600 p-2 text-sm rounded mb-4">{error}</div>}
                            {success && <div className="bg-green-50 text-green-600 p-2 text-sm rounded mb-4">{success}</div>}

                            {canView ? (
                                <button disabled className="btn w-full bg-green-100 text-green-700 border border-green-200 cursor-default">
                                    {isOwner ? 'You Teach This' : '✅ You Own This Class'}
                                </button>
                            ) : (
                                <button
                                    onClick={handlePurchase}
                                    disabled={purchasing}
                                    className={`btn btn-primary w-full ${purchasing ? 'opacity-70' : ''}`}
                                >
                                    {purchasing ? 'Processing...' : `Purchase for ${classItem.price} Credits`}
                                </button>
                            )}

                            {!canView && (
                                <p className="text-xs text-center mt-3 text-muted">
                                    Your current balance: <strong>{userCredits} Credits</strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
