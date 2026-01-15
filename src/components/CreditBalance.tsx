'use client';

import { useEffect, useState } from 'react';

interface CreditBalanceProps {
    initialCredits?: number;
    refreshInterval?: number; // polling interval in ms (optional)
}

export default function CreditBalance({ initialCredits, refreshInterval }: CreditBalanceProps) {
    const [credits, setCredits] = useState<number | null>(initialCredits ?? null);
    const [loading, setLoading] = useState(!initialCredits && initialCredits !== 0);

    const fetchCredits = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setCredits(data.user.credits);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (credits === null) {
            fetchCredits();
        }

        if (refreshInterval) {
            const interval = setInterval(fetchCredits, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    if (loading) {
        return <div className="animate-pulse h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>;
    }

    return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 backdrop-blur-md text-amber-300 px-4 py-1.5 rounded-full font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            <span className="text-xl drop-shadow-md">🪙</span>
            <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">{credits}</span>
        </div>
    );
}
