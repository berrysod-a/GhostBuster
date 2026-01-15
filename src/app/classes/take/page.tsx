'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TakeClassPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        department: '',
    });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!videoFile) {
            setError('Please upload a video file');
            setLoading(false);
            return;
        }

        try {
            // 1. Convert video to base64 (for simple demo upload - prod would use signed URL)
            const reader = new FileReader();
            reader.readAsDataURL(videoFile);

            reader.onloadend = async () => {
                const videoData = reader.result;

                try {
                    const res = await fetch('/api/classes', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...formData,
                            videoData: videoData,
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) throw new Error(data.error || 'Failed to create class');

                    setSuccess(true);
                    setTimeout(() => {
                        router.push('/classes');
                    }, 3000);

                } catch (err: any) {
                    setError(err.message);
                    setLoading(false);
                }
            };

        } catch (err: any) {
            setError('Error processing file');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20">
                <div className="card max-w-md text-center p-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="heading-2 text-green-600">Class Uploaded!</h2>
                    <p className="text-muted mb-4">Your class "{formData.title}" is live.</p>
                    <p className="font-medium">You will earn <span className="text-primary">{formData.price} credits</span> every time someone attends!</p>
                    <p className="text-sm text-muted mt-6">Redirecting to menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-2xl mx-auto">
                <Link href="/classes" className="text-muted hover:text-foreground mb-4 inline-block">&larr; Back to Classes</Link>
                <div className="card glass">
                    <h1 className="heading-2 mb-2">Upload a Class 📹</h1>
                    <p className="text-muted mb-6">Share your knowledge and earn credits from other students.</p>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Class Title</label>
                            <input name="title" type="text" className="input" placeholder="e.g. Intro to React" value={formData.title} onChange={handleChange} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea name="description" className="input min-h-[100px]" placeholder="What will students learn?" value={formData.description} onChange={handleChange} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select name="department" className="input" value={formData.department} onChange={handleChange} required>
                                    <option value="">Select...</option>
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
                                <label className="block text-sm font-medium mb-1">Price (Credits)</label>
                                <input name="price" type="number" min="0" className="input" placeholder="e.g. 5" value={formData.price} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Video Upload</label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <input type="file" accept="video/*" onChange={handleFileChange} className="w-full" required />
                                <p className="text-xs text-muted mt-2">Max file size depends on Cloudinary plan</p>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Uploading Class...' : 'Publish Class'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
