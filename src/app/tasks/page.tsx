'use client';

import Link from 'next/link';

export default function TasksMenuPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                    <h1 className="heading-1">Tasks ✅</h1>
                    <p className="text-muted text-lg">Earn credits by helping others, or get help with your work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Give Task */}
                    <Link href="/tasks/give" className="group card hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 p-6">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="heading-2 mb-2">Give Task</h2>
                            <p className="text-muted">Need help? Post a task, set a reward, and find a helper.</p>
                            <span className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Post Task</span>
                        </div>
                    </Link>

                    {/* Do Task */}
                    <Link href="/tasks/do" className="group card hover:border-lime-400 dark:hover:border-lime-600 transition-all hover:shadow-xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 p-6">
                            <div className="text-6xl mb-4">💪</div>
                            <h2 className="heading-2 mb-2">Do Task</h2>
                            <p className="text-muted">Browse available tasks, apply, and earn credits upon completion.</p>
                            <span className="mt-4 inline-block bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">Find Tasks</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
