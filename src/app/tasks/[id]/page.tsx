'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TaskDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch all tasks and find the one (simplest for now given API structure)
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                const found = data.tasks.find((t: any) => t._id === id);
                setTask(found);
                setLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        setActionLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/tasks/${id}/apply`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess('Application successful! Task is now In Progress.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!confirm('Are you sure? This will deduct credits from your balance and pay the assignee.')) return;

        setActionLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/tasks/${id}/complete`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess('Task marked as complete! Payment sent.');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    if (!task) return <div className="p-8 text-center text-muted">Task not found</div>;

    const isCreator = session?.user?.id === task.creatorId._id;
    const isAssignee = session?.user?.id === task.assigneeId?._id;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <Link href="/tasks/do" className="text-muted hover:underline mb-4 inline-block">&larr; Back to Task Board</Link>

                <div className="card">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block
                        ${task.status === 'open' ? 'bg-green-100 text-green-700' :
                                    task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-slate-200 text-slate-700'}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                            <h1 className="heading-2 mb-1">{task.title}</h1>
                            <p className="text-muted">Posted by {task.creatorId.name} • {task.creatorId.department}</p>
                        </div>
                        <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            <span className="block text-sm text-yellow-800 dark:text-yellow-200">Reward</span>
                            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{task.price} 🪙</span>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{task.description}</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}

                    <div className="border-t pt-6">
                        {/* Logic for Buttons */}

                        {/* 1. Open Task & Not Creator -> Apply Button */}
                        {task.status === 'open' && !isCreator && (
                            <button
                                onClick={handleApply}
                                disabled={actionLoading}
                                className="btn btn-primary w-full"
                            >
                                {actionLoading ? 'Applying...' : 'Apply for this Task'}
                            </button>
                        )}

                        {/* 2. In Progress & Creator -> Mark Complete Button */}
                        {task.status === 'in_progress' && isCreator && (
                            <div>
                                <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-sm flex items-center gap-2">
                                    <span>ℹ️</span> Assignee: <strong>{task.assigneeId?.name}</strong> is working on this.
                                </div>
                                <button
                                    onClick={handleComplete}
                                    disabled={actionLoading}
                                    className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                                >
                                    {actionLoading ? 'Processing...' : 'Mark Complete & Pay Reward'}
                                </button>
                            </div>
                        )}

                        {/* 3. In Progress & Assignee -> View Status */}
                        {task.status === 'in_progress' && isAssignee && (
                            <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                                <p className="font-bold">You are working on this task!</p>
                                <p className="text-sm mt-1">Contact the creator when done. They will mark it complete to release funds.</p>
                            </div>
                        )}

                        {/* 4. Completed -> View Status */}
                        {task.status === 'completed' && (
                            <div className="text-center p-4 bg-slate-100 text-slate-600 rounded-lg">
                                <p className="font-bold">Task Completed</p>
                                {isAssignee && <p className="text-sm text-green-600 mt-1">You earned {task.price} credits!</p>}
                            </div>
                        )}

                        {/* 5. Open & Creator -> View Status */}
                        {task.status === 'open' && isCreator && (
                            <div className="text-center p-4 bg-slate-50 text-slate-500 rounded-lg border border-dashed">
                                Waiting for applicants...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
