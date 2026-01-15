'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreditBalance from '@/components/CreditBalance';

interface ClassItem {
    _id: string;
    title: string;
    description: string;
    price: number;
    instructorId: {
        _id: string;
        name: string;
        department: string;
    };
    department: string;
    thumbnailUrl: string;
    purchasedBy: string[];
}

export default function AttendClassPage() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [filter, setFilter] = useState('');

    // Fetch classes logic
    const fetchClasses = async () => {
        setLoading(true);
        try {
            const url = filter ? `/api/classes?department=${encodeURIComponent(filter)}` : '/api/classes';
            const res = await fetch(url);
            const data = await res.json();
            setClasses(data.classes);
            setUserId(data.userId);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [filter]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/classes" className="text-sm text-muted hover:underline mb-1 inline-block">&larr; Back to Menu</Link>
                        <h1 className="heading-2">Browse Classes</h1>
                    </div>
                    <CreditBalance />
                </div>

                {/* Filter */}
                <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 flex gap-2">
                    <button
                        onClick={() => setFilter('')}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${!filter ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border hover:bg-slate-100'}`}
                    >
                        All Departments
                    </button>
                    {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Biotechnology', 'Others'].map(dept => (
                        <button
                            key={dept}
                            onClick={() => setFilter(dept)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filter === dept ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border hover:bg-slate-100'}`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card h-64 animate-pulse bg-slate-200 dark:bg-slate-800"></div>
                        ))}
                    </div>
                ) : classes.length === 0 ? (
                    <div className="text-center py-20 text-muted">
                        <p className="text-xl">No classes found in this department.</p>
                        <Link href="/classes/take" className="text-primary hover:underline mt-2 inline-block">Upload one yourself?</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <Link href={`/classes/${cls._id}`} key={cls._id} className="card group hover:shadow-lg transition-all flex flex-col h-full p-0 overflow-hidden">
                                <div className="aspect-video bg-slate-200 dark:bg-slate-700 relative">
                                    {/* Placeholder for video thumbnail if authentic one fails or for consistent look */}
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                                        📺
                                    </div>
                                    {cls.thumbnailUrl && <img src={cls.thumbnailUrl} alt={cls.title} className="absolute inset-0 w-full h-full object-cover" />}

                                    {/* Price Tag */}
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-sm">
                                        {cls.price} Credits
                                    </div>

                                    {/* Ownership badge */}
                                    {userId && cls.instructorId._id === userId && (
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            YOUR CLASS
                                        </div>
                                    )}
                                    {userId && cls.purchasedBy.includes(userId) && (
                                        <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            OWNED
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                            {cls.department}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{cls.title}</h3>
                                    <p className="text-muted text-sm mb-4 line-clamp-2">{cls.description}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                                                {cls.instructorId.name?.[0] || 'I'}
                                            </div>
                                            <span className="text-muted truncate max-w-[100px]">{cls.instructorId.name}</span>
                                        </div>
                                        <span className="text-primary font-medium">View Details &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
