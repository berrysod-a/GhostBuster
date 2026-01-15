'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GiveTaskPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create task');

            setSuccess(true);
            setTimeout(() => {
                router.push('/tasks');
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20">
                <div className="card max-w-md text-center p-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="heading-2 text-green-600">Task Posted!</h2>
                    <p className="text-muted mb-4">Your task "{formData.title}" is now available.</p>
                    <p className="text-sm text-muted mt-6">Redirecting to menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <Link href="/tasks" className="text-muted hover:text-foreground mb-4 inline-block">&larr; Back to Tasks</Link>
                <div className="card glass">
                    <h1 className="heading-2 mb-2">Give a Task 📝</h1>
                    <p className="text-muted mb-6">Describe what you need help with and set a reward.</p>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Task Title</label>
                            <input name="title" type="text" className="input" placeholder="e.g. Help with Data Structures" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" className="input min-h-[100px]" placeholder="Detailed description of requirements..." value={formData.description} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Reward (Credits)</label>
                            <input name="price" type="number" min="1" className="input" placeholder="e.g. 10" value={formData.price} onChange={handleChange} required />
                            <p className="text-xs text-muted mt-1">These credits will be deducted when you mark the task as completed.</p>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Posting Task...' : 'Post Task'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
