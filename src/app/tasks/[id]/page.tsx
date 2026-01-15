'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Coins, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

export default function TaskDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'apply' | 'complete' | null>(null);

    useEffect(() => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                const found = data.tasks.find((t: any) => t._id === id);
                setTask(found);
                setLoading(false);
            });
    }, [id]);

    const handleAction = async () => {
        if (!confirmAction) return;
        setActionLoading(true);
        setError('');

        const endpoint = confirmAction === 'apply'
            ? `/api/tasks/${id}/apply`
            : `/api/tasks/${id}/complete`;

        try {
            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess(confirmAction === 'apply' ? 'Application successful! Task is now In Progress.' : 'Task marked as complete! Payment sent.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setError(err.message);
            setActionLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    const openConfirmModal = (action: 'apply' | 'complete') => {
        setConfirmAction(action);
        setIsConfirmModalOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    if (!task) return <div className="p-8 text-center text-white">Task not found</div>;

    const isCreator = session?.user?.id === task.creatorId._id;
    const isAssignee = session?.user?.id === task.assigneeId?._id;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'open': return 'success';
            case 'in_progress': return 'warning';
            case 'completed': return 'neutral';
            default: return 'neutral';
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 pb-20">
            <div className="container max-w-4xl mx-auto">
                <Link
                    href="/tasks/do"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Task Board
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <Badge variant={getStatusVariant(task.status)} className="mb-3 uppercase tracking-wider text-[10px]">
                                    {task.status.replace('_', ' ')}
                                </Badge>
                                <h1 className="text-3xl font-bold text-white leading-tight">{task.title}</h1>
                            </div>
                        </div>

                        <Card variant="glass" className="p-8 backdrop-blur-md">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full block" />
                                Details
                            </h3>
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                                {task.description}
                            </p>
                        </Card>

                        {/* Status Messages */}
                        {error && (
                            <div className="bg-red-500/10 text-red-300 p-4 rounded-xl border border-red-500/20 flex items-start gap-2">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 text-green-300 p-4 rounded-xl border border-green-500/20 flex items-start gap-2">
                                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                                {success}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card variant="solid" className="p-6 bg-[#0f1115] border-emerald-500/20">
                            <div className="text-center mb-6 pb-6 border-b border-white/10">
                                <p className="text-gray-400 mb-1">Reward</p>
                                <div className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-2">
                                    <Coins className="text-yellow-500" size={32} />
                                    {task.price}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Credits upon completion</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <User size={20} className="text-gray-300" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500">Posted by</p>
                                        <p className="text-white font-medium truncate">{task.creatorId.name}</p>
                                        <p className="text-xs text-emerald-400">{task.creatorId.department}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Clock size={20} className="text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Status</p>
                                        <p className="text-white font-medium capitalize">{task.status.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {/* 1. Open Task & Not Creator -> Apply */}
                                {task.status === 'open' && !isCreator && (
                                    <Button onClick={() => openConfirmModal('apply')} className="w-full bg-emerald-600 hover:bg-emerald-500">
                                        Apply for this Task
                                    </Button>
                                )}

                                {/* 2. In Progress & Creator -> Mark Complete */}
                                {task.status === 'in_progress' && isCreator && (
                                    <>
                                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm text-blue-300 mb-2">
                                            Assignee: <span className="font-bold text-white">{task.assigneeId?.name}</span> is working on this.
                                        </div>
                                        <Button onClick={() => openConfirmModal('complete')} className="w-full bg-emerald-600 hover:bg-emerald-500">
                                            Mark Complete & Pay
                                        </Button>
                                    </>
                                )}

                                {/* 3. In Progress & Assignee -> View Status */}
                                {task.status === 'in_progress' && isAssignee && (
                                    <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-center">
                                        <p className="text-yellow-400 font-bold mb-1">In Progress</p>
                                        <p className="text-xs text-gray-400">You are assigned to this task. Contact the creator when done.</p>
                                    </div>
                                )}

                                {/* 4. Completed */}
                                {task.status === 'completed' && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                        <p className="text-gray-300 font-bold">Task Completed</p>
                                        {isAssignee && <p className="text-xs text-emerald-400 mt-1">You earned {task.price} credits!</p>}
                                    </div>
                                )}

                                {/* 5. Open & Creator */}
                                {task.status === 'open' && isCreator && (
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center border-dashed">
                                        <p className="text-gray-500 text-sm">Waiting for applicants...</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                <Modal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    title={confirmAction === 'apply' ? 'Apply for Task' : 'Confirm Completion'}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleAction}
                                isLoading={actionLoading}
                                className={confirmAction === 'complete' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                            >
                                Confirm
                            </Button>
                        </>
                    }
                >
                    {confirmAction === 'apply' ? (
                        <p>Are you sure you want to apply for this task? The creator will be notified.</p>
                    ) : (
                        <p>Are you sure the task is complete? This will transfer <strong>{task.price} credits</strong> from your balance to the assignee.</p>
                    )}
                </Modal>
            </div>
        </div>
    );
}
