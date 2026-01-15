'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreditBalance from '@/components/CreditBalance';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800">
        <div className="container flex justify-between items-center py-3">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
            UniCredit
          </Link>

          <div className="flex items-center gap-4">
            <CreditBalance refreshInterval={5000} />
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold">
                {session?.user?.name?.[0] || 'U'}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-medium truncate">{session?.user?.name}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-b-xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="heading-2">Dashboard</h1>
          <p className="text-muted">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Classes Card */}
          <Link href="/classes" className="group card hover:border-blue-300 dark:hover:border-blue-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 text-2xl">
                🎓
              </div>
              <h2 className="text-xl font-bold mb-2">Classes</h2>
              <p className="text-muted mb-4">Learn new skills or teach others to earn credits.</p>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Attend Class</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Take Class</span>
              </div>
            </div>
          </Link>

          {/* Tasks Card */}
          <Link href="/tasks" className="group card hover:border-green-300 dark:hover:border-green-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 text-2xl">
                ✅
              </div>
              <h2 className="text-xl font-bold mb-2">Tasks</h2>
              <p className="text-muted mb-4">Get help with tasks or complete them to earn rewards.</p>
              <div className="flex gap-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Give Task</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Do Task</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats or Recent Activity could go here later */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold mb-1">Boost your earnings!</h3>
              <p className="opacity-90 text-sm">Upload a popular class or complete high-reward tasks.</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
      </main>
    </div>
  );
}
