'use client';

import Link from 'next/link';

export default function ClassesMenuPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                    <h1 className="heading-1">Classes 🎓</h1>
                    <p className="text-muted text-lg">Teach to earn credits, or spend credits to learn.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Take Class (Upload) */}
                    <Link href="/classes/take" className="group card hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 p-6">
                            <div className="text-6xl mb-4">📹</div>
                            <h2 className="heading-2 mb-2">Take (Upload) Class</h2>
                            <p className="text-muted">Create a class, set your price, and earn credits when others attend.</p>
                            <span className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Create Class</span>
                        </div>
                    </Link>

                    {/* Attend Class (Consume) */}
                    <Link href="/classes/attend" className="group card hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 p-6">
                            <div className="text-6xl mb-4">👀</div>
                            <h2 className="heading-2 mb-2">Attend Class</h2>
                            <p className="text-muted">Browse available classes, learn new skills, and expand your knowledge.</p>
                            <span className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">Browse Classes</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
