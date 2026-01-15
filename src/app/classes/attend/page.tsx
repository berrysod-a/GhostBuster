'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, GraduationCap, Video } from 'lucide-react';
import CreditBalance from '@/components/CreditBalance';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

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

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Biotechnology', 'Others'];

export default function AttendClassPage() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [filter, setFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredClasses = classes.filter(cls =>
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen py-8 px-4 pb-20">
            <div className="container max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Link
                            href="/classes"
                            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2 gap-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Menu
                        </Link>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <GraduationCap className="text-indigo-400" />
                            Browse Classes
                        </h1>
                    </div>
                    <CreditBalance />
                </div>

                {/* Filters & Search */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setFilter('')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!filter
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                        >
                            All Departments
                        </button>
                        {DEPARTMENTS.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setFilter(dept)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === dept
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="rounded-xl h-[340px] bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredClasses.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No classes found</h3>
                        <p className="text-gray-400">Try adjusting your filters or upload a class yourself.</p>
                        <Link href="/classes/take" className="mt-4 inline-block btn btn-primary">
                            Upload Class
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredClasses.map((cls) => {
                            const isOwner = userId && cls.instructorId._id === userId;
                            const isPurchased = userId && cls.purchasedBy.includes(userId);

                            return (
                                <motion.div key={cls._id} variants={item}>
                                    <Link href={`/classes/${cls._id}`} className="block h-full group">
                                        <Card className="h-full flex flex-col p-0 overflow-hidden hover:border-indigo-500/50 transition-colors bg-[#0f1115]">
                                            {/* Thumbnail Area */}
                                            <div className="relative aspect-video bg-gray-800 overflow-hidden">
                                                {cls.thumbnailUrl ? (
                                                    <img src={cls.thumbnailUrl} alt={cls.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 group-hover:scale-105 transition-transform duration-500">
                                                        <Video className="w-12 h-12 text-indigo-500/40" />
                                                    </div>
                                                )}

                                                {/* Overlays */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                                <div className="absolute top-3 right-3">
                                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10 shadow-xl flex items-center gap-1">
                                                        <span className="text-yellow-400">💰</span> {cls.price}
                                                    </span>
                                                </div>

                                                {(isOwner || isPurchased) && (
                                                    <div className="absolute top-3 left-3">
                                                        <Badge variant={isOwner ? "info" : "success"}>
                                                            {isOwner ? "YOUR CLASS" : "OWNED"}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="mb-3">
                                                    <Badge variant="neutral" className="text-[10px] uppercase tracking-wider mb-2">
                                                        {cls.department}
                                                    </Badge>
                                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                        {cls.title}
                                                    </h3>
                                                </div>

                                                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                                    {cls.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#0f1115]">
                                                            {cls.instructorId.name?.[0] || 'I'}
                                                        </div>
                                                        <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                                            {cls.instructorId.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-medium text-indigo-400 group-hover:translate-x-1 transition-transform">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
