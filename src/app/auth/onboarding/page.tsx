'use client';

import { useState } from 'react';
import { useSession, updateSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        className: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to update profile');

            // Update local session
            await update({ isOnboarded: true, name: formData.name });

            // Redirect to home
            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
            <div className="card max-w-md w-full glass">
                <div className="text-center mb-6">
                    <h1 className="heading-1 text-primary">Welcome! 👋</h1>
                    <p className="text-muted">Let's set up your profile to get started.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <div className="text-xl">🎁</div>
                    <div>
                        <h3 className="font-semibold">50 Credits Waiting</h3>
                        <p className="text-sm">Complete your profile to unlock your welcome bonus.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium mb-1">
                            Department
                        </label>
                        <select
                            id="department"
                            name="department"
                            className="input"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Biotechnology">Biotechnology</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="className" className="block text-sm font-medium mb-1">
                            Class / Year
                        </label>
                        <input
                            id="className"
                            name="className"
                            type="text"
                            placeholder="e.g. 2nd Year A"
                            className="input"
                            value={formData.className}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Setting up...' : 'Get Started'}
                    </button>
                </form>
            </div>
        </div>
    );
}
