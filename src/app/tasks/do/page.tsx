'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, CheckCircle2, Coins } from 'lucide-react';
import CreditBalance from '@/components/CreditBalance';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

interface TaskItem {
    _id: string;
    title: string;
    description: string;
    price: number;
    creatorId: {
        _id: string;
        name: string;
        department: string;
    };
    status: 'open' | 'in_progress' | 'completed';
}

export default function DoTaskPage() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                setTasks(data.tasks);
                setLoading(false);
            });
    }, []);

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'open': return 'success';
            case 'in_progress': return 'warning';
            case 'completed': return 'neutral';
            default: return 'neutral';
        }
    };

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
                            href="/tasks"
                            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2 gap-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Menu
                        </Link>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-400" />
                            Browse Tasks
                        </h1>
                    </div>
                    <CreditBalance />
                </div>

                {/* Search */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Find opportunities..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="rounded-xl h-[280px] bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <div className="text-4xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-white mb-2">No tasks found</h3>
                        <p className="text-gray-400">Be the first to ask for help!</p>
                        <Link href="/tasks/give" className="mt-4 inline-block btn bg-emerald-600 text-white hover:bg-emerald-500">
                            Give a Task
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredTasks.map((task) => (
                            <motion.div key={task._id} variants={item}>
                                <Link href={`/tasks/${task._id}`} className="block h-full group">
                                    <Card className="h-full flex flex-col p-6 hover:border-emerald-500/50 transition-all bg-[#0f1115] hover:bg-emerald-500/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant={getStatusVariant(task.status)} className="uppercase tracking-wider text-[10px]">
                                                {task.status.replace('_', ' ')}
                                            </Badge>
                                            <div className="flex items-center text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded text-sm">
                                                <Coins size={14} className="mr-1" />
                                                {task.price}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                            {task.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                                            {task.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#0f1115]">
                                                    {task.creatorId.name?.[0] || 'U'}
                                                </div>
                                                <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                                    {task.creatorId.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                                                View Details →
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
