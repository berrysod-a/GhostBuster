'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, FilePlus, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Footer from '@/components/Footer';

export default function TasksMenuPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="container py-8 flex-grow max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-6 gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-400 w-10 h-10" />
                        Tasks
                    </h1>
                    <p className="text-xl text-muted-foreground">Get help with your work, or help others to earn credits.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]"
                >
                    {/* Give Task (Post) */}
                    <Link href="/tasks/give" className="group h-full">
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:border-emerald-500/50 transition-all group-hover:bg-emerald-500/5">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <span className="text-5xl">➕</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Give a Task</h2>
                            <p className="text-muted-foreground text-lg max-w-xs mx-auto mb-8">
                                Need assistance? Post a task, offer a reward, and find a helper quickly.
                            </p>
                            <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold group-hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/25">
                                Post a Task
                            </span>
                        </Card>
                    </Link>

                    {/* Do Task (Complete) */}
                    <Link href="/tasks/do" className="group h-full">
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:border-lime-500/50 transition-all group-hover:bg-lime-500/5">
                            <div className="w-24 h-24 bg-lime-500/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ring-1 ring-lime-500/30 shadow-[0_0_30px_rgba(132,204,22,0.2)]">
                                <span className="text-5xl">💪</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Do a Task</h2>
                            <p className="text-muted-foreground text-lg max-w-xs mx-auto mb-8">
                                Look for opportunities. Complete tasks for others and stack up your credits.
                            </p>
                            <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 text-white font-semibold border border-white/20 group-hover:bg-white/20 transition-colors">
                                Find Opportunities
                            </span>
                        </Card>
                    </Link>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
