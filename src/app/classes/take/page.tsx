'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Video, UploadCloud } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

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
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8 bg-green-500/10 border-green-500/20">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Class Uploaded!</h2>
                    <p className="text-gray-300 mb-4">Your class "{formData.title}" is live.</p>
                    <p className="font-medium text-green-400">You will earn {formData.price} credits every time someone attends!</p>
                    <p className="text-sm text-gray-500 mt-6 animate-pulse">Redirecting to menu...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container max-w-3xl mx-auto">
                <Link
                    href="/classes"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 gap-2"
                >
                    <ArrowLeft size={16} />
                    Back to Classes
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <Video className="text-indigo-400" />
                        Upload a Class
                    </h1>
                    <p className="text-gray-400">Share your knowledge and earn credits from other students.</p>
                </div>

                <Card variant="glass" className="p-8 backdrop-blur-xl">
                    {error && (
                        <div className="bg-red-500/10 text-red-300 p-4 rounded-xl mb-6 text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Class Title"
                            name="title"
                            placeholder="e.g. Intro to Advanced React Patterns"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <Textarea
                            label="Description"
                            name="description"
                            placeholder="What will students learn in this class?"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                options={[
                                    { label: 'Computer Science', value: 'Computer Science' },
                                    { label: 'Information Technology', value: 'Information Technology' },
                                    { label: 'Electronics', value: 'Electronics' },
                                    { label: 'Mechanical', value: 'Mechanical' },
                                    { label: 'Civil', value: 'Civil' },
                                    { label: 'Biotechnology', value: 'Biotechnology' },
                                    { label: 'Others', value: 'Others' },
                                ]}
                                required
                            />

                            <Input
                                label="Price (Credits)"
                                name="price"
                                type="number"
                                min="0"
                                placeholder="e.g. 20"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video Upload</label>
                            <div className="border border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors group cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                <div className="space-y-2 pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/30 transition-colors">
                                        <UploadCloud className="text-indigo-400 w-6 h-6" />
                                    </div>
                                    <p className="text-white font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-400">MP4, WebM or Ogg (Max 100MB)</p>
                                    {videoFile && (
                                        <div className="mt-4 p-2 bg-indigo-500/20 rounded text-indigo-300 text-sm font-medium">
                                            Selected: {videoFile.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                            {loading ? 'Uploading Class...' : 'Publish Class'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
