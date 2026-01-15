'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreditBalance from '@/components/CreditBalance';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2, User, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (!session.user.isOnboarded) {
        router.push('/auth/onboarding');
      } else {
        setLoading(false);
      }
    }
  }, [status, session, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_20px_rgba(79,70,229,0.5)]"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass border-b border-white/5 backdrop-blur-xl"
      >
        <div className="container flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            UniCredit
          </Link>

          <div className="flex items-center gap-4">
            <CreditBalance />
            <div className="relative group perspective-1000">
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg ring-2 ring-white/10 transition-transform group-hover:scale-105">
                {session?.user?.name?.[0] || 'U'}
              </button>
              <div className="absolute right-0 mt-4 w-56 glass-card rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                <div className="p-4 border-b border-white/5">
                  <p className="font-medium truncate text-white">{session?.user?.name}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-b-xl flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container py-12 max-w-5xl mx-auto">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-indigo-400">{session?.user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-muted-foreground">What would you like to do today?</p>
        </motion.div>

        {/* Main Grid Options */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Classes Card */}
          <Link href="/classes" className="group block h-full">
            <Card className="h-full flex flex-col items-center text-center p-8 hover:border-indigo-500/50 transition-colors group">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <span className="text-4xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Classes</h2>
              <p className="text-muted-foreground">Learn from peers or share your knowledge to earn credits.</p>
            </Card>
          </Link>

          {/* Tasks Card */}
          <Link href="/tasks" className="group block h-full">
            <Card className="h-full flex flex-col items-center text-center p-8 hover:border-emerald-500/50 transition-colors group">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tasks</h2>
              <p className="text-muted-foreground">Get help with assignments or help others to earn rewards.</p>
            </Card>
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
