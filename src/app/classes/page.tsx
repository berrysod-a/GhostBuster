'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Footer from '@/components/Footer';

export default function ClassesMenuPage() {
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
                        <GraduationCap className="text-indigo-400 w-10 h-10" />
                        Classes
                    </h1>
                    <p className="text-xl text-muted-foreground">Teach others to earn credits, or spend credits to learn new skills.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]"
                >
                    {/* Take a Class (Teach) */}
                    <Link href="/classes/take" className="group h-full">
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:border-indigo-500/50 transition-all group-hover:bg-indigo-500/5">
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ring-1 ring-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                                <span className="text-5xl">🎓</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Take a Class</h2>
                            <p className="text-muted-foreground text-lg max-w-xs mx-auto mb-8">
                                Share your knowledge. Create a class and earn credits for every student who attends.
                            </p>
                            <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25">
                                Start Teaching
                            </span>
                        </Card>
                    </Link>

                    {/* Attend a Class (Learn) */}
                    <Link href="/classes/attend" className="group h-full">
                        <Card className="h-full flex flex-col items-center justify-center text-center p-8 hover:border-blue-500/50 transition-all group-hover:bg-blue-500/5">
                            <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ring-1 ring-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <span className="text-5xl">📖</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Attend a Class</h2>
                            <p className="text-muted-foreground text-lg max-w-xs mx-auto mb-8">
                                Browse the catalog. Learn from your peers and expand your skillset.
                            </p>
                            <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 text-white font-semibold border border-white/20 group-hover:bg-white/20 transition-colors">
                                Browse Catalog
                            </span>
                        </Card>
                    </Link>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
