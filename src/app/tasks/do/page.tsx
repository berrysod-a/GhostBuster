'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreditBalance from '@/components/CreditBalance';

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

    useEffect(() => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                setTasks(data.tasks);
                setLoading(false);
            });
    }, []);

    // Filter only open tasks for main view, OR show all? 
    // Requirement says: "Display all available tasks submitted by other users" - implies Open ones.
    // But also "Display task status as either Pending or Completed in the task list"
    // So I'll show all but categorize/visualize status.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/tasks" className="text-sm text-muted hover:underline mb-1 inline-block">&larr; Back to Menu</Link>
                        <h1 className="heading-2">Task Board</h1>
                    </div>
                    <CreditBalance />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="card h-40 animate-pulse bg-slate-200 dark:bg-slate-800"></div>)}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20 text-muted">No tasks available right now.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <Link href={`/tasks/${task._id}`} key={task._id} className="card group hover:shadow-md transition-all flex flex-col h-full border-l-4 border-l-primary hover:border-l-primary/80">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                        ${task.status === 'open' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-slate-200 text-slate-700'}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-400">
                                        {task.price} 🪙
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg mb-2">{task.title}</h3>
                                <p className="text-muted text-sm line-clamp-2 mb-4 flex-1">{task.description}</p>

                                <div className="border-t pt-4 mt-auto flex justify-between items-center text-sm">
                                    <span className="text-muted">By {task.creatorId.name}</span>
                                    <span className="text-primary font-medium group-hover:underline">View &rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
