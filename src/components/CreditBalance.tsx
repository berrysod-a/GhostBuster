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
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-md transform transition-transform hover:scale-105">
            <span className="text-xl">🪙</span>
            <span className="text-lg">{credits}</span>
        </div>
    );
}
