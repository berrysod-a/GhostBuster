'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FilePlus, Coins } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

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
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 bg-emerald-500/10 border-emerald-500/20">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Task Posted!</h2>
                    <p className="text-gray-300 mb-4">Your task "{formData.title}" is now available to others.</p>
                    <p className="font-medium text-emerald-400">Helpers will see a reward of {formData.price} credits.</p>
                    <p className="text-sm text-gray-500 mt-6 animate-pulse">Redirecting to menu...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <Link
                    href="/tasks"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Tasks
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <FilePlus className="text-emerald-400" />
                        Give a Task
                    </h1>
                    <p className="text-gray-400">Describe what you need help with and set a reward.</p>
                </div>

                <Card variant="glass" className="p-8 backdrop-blur-xl border border-emerald-500/20">
                    {error && (
                        <div className="bg-red-500/10 text-red-300 p-4 rounded-xl mb-6 text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Task Title"
                            name="title"
                            placeholder="e.g. Help needed with Data Structures Assignment"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Textarea
                            label="Detailed Requirements"
                            name="description"
                            placeholder="Describe exactly what needs to be done. Include deadlines or specific constraints..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="min-h-[150px]"
                        />

                        <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                            <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                <Coins size={20} />
                                <span className="font-medium">Set Reward</span>
                            </div>
                            <Input
                                name="price"
                                type="number"
                                min="1"
                                placeholder="e.g. 50"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="bg-black/20"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                These credits will be deducted from your account only after you mark the task as completed.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                            size="lg"
                            isLoading={loading}
                        >
                            {loading ? 'Posting...' : 'Post Task'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
