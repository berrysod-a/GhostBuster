'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Lock, Play, Clock, Share2, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { motion } from 'framer-motion';

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
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

    useEffect(() => {
        // Fetch user credits
        fetch('/api/users').then(r => r.json()).then(d => setUserCredits(d.user?.credits || 0));

        // Fetch class details (simulated by finding in list for now as per previous logic)
        fetch('/api/classes').then(r => r.json()).then(data => {
            const found = data.classes.find((c: any) => c._id === id);
            setClassItem(found);
            setLoading(false);
        });
    }, [id]);

    const handlePurchase = async () => {
        if (!session) return;
        setPurchasing(true);
        setError('');

        try {
            const res = await fetch(`/api/classes/${id}/purchase`, {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setSuccess('Purchase successful! Unlocking content...');
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err: any) {
            setError(err.message);
            setPurchasing(false);
            setIsPurchaseModalOpen(false); // Close on error to show error msg
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!classItem) return <div className="p-8 text-center text-white">Class not found</div>;

    const isOwner = session?.user?.id === classItem.instructorId._id;
    const isPurchased = classItem.purchasedBy.includes(session?.user?.id);
    const canView = isOwner || isPurchased;

    return (
        <div className="min-h-screen py-12 px-4 pb-20">
            <div className="container max-w-6xl mx-auto">
                <Link
                    href="/classes/attend"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Browse
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card variant="solid" className="p-0 overflow-hidden border-indigo-500/20 bg-black/40">
                            <div className="aspect-video bg-black relative flex items-center justify-center group">
                                {canView ? (
                                    <video
                                        src={classItem.videoUrl}
                                        controls
                                        className="w-full h-full"
                                        poster={classItem.thumbnailUrl}
                                    />
                                ) : (
                                    <>
                                        {/* Blurred Background if available, else Gradient */}
                                        {classItem.thumbnailUrl ? (
                                            <img src={classItem.thumbnailUrl} alt="Locked" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40" />
                                        )}

                                        <div className="relative z-10 text-center p-8">
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/20 shadow-2xl">
                                                <Lock className="w-8 h-8 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Premium Content</h2>
                                            <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                                Unlock this masterclass to access the full video lessons and resources.
                                            </p>
                                            <Button
                                                onClick={() => setIsPurchaseModalOpen(true)}
                                                className="shadow-xl"
                                            >
                                                Unlock for {classItem.price} Credits
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white tracking-tight">{classItem.title}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <Badge variant="info">{classItem.department}</Badge>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Clock size={14} /> Created recently
                                </span>
                            </div>
                            <Card variant="glass" className="p-6 backdrop-blur-md">
                                <h3 className="text-lg font-semibold text-white mb-3">About this class</h3>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {classItem.description}
                                </p>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card variant="glass" className="p-6 backdrop-blur-xl border-t-4 border-t-indigo-500">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                                Instructor
                                <Share2 className="text-gray-500 hover:text-white cursor-pointer transition-colors" size={18} />
                            </h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white ring-2 ring-indigo-500/30">
                                    {classItem.instructorId.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{classItem.instructorId.name}</p>
                                    <p className="text-xs text-indigo-300">{classItem.instructorId.department}</p>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 my-6" />

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Price</span>
                                <span className="text-2xl font-bold text-white flex items-center gap-1">
                                    {classItem.price} <span className="text-base font-normal text-gray-500">Credits</span>
                                </span>
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="bg-red-500/10 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/20 flex items-start gap-2">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-500/10 text-green-300 p-3 rounded-lg mb-4 text-sm border border-green-500/20">
                                    {success}
                                </div>
                            )}

                            {/* Action Button */}
                            {canView ? (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                    <p className="text-green-400 font-medium">
                                        {isOwner ? '🎓 You teach this class' : '✅ You own this class'}
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => setIsPurchaseModalOpen(true)}
                                    className="w-full"
                                    size="lg"
                                >
                                    Purchase Access
                                </Button>
                            )}

                            {!canView && (
                                <p className="text-xs text-center mt-3 text-gray-500">
                                    One-time payment. Lifetime access.
                                </p>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Purchase Confirmation Modal */}
                <Modal
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    title="Confirm Purchase"
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsPurchaseModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handlePurchase}
                                isLoading={purchasing}
                                disabled={userCredits < classItem.price}
                            >
                                Confirm Purchase
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-300">
                            Are you sure you want to purchase <strong>"{classItem.title}"</strong>?
                        </p>

                        <div className="bg-white/5 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Current Balance</span>
                                <span className="text-white font-medium">{userCredits} Credits</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-400">
                                <span>Cost</span>
                                <span>- {classItem.price} Credits</span>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div className="flex justify-between font-medium">
                                <span className={userCredits < classItem.price ? "text-red-400" : "text-green-400"}>
                                    Remaining
                                </span>
                                <span className={userCredits < classItem.price ? "text-red-400" : "text-green-400"}>
                                    {userCredits - classItem.price} Credits
                                </span>
                            </div>
                        </div>

                        {userCredits < classItem.price && (
                            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                Insufficient funds. You need {classItem.price - userCredits} more credits.
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
