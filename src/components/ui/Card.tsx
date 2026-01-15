'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    variant?: 'solid' | 'glass';
    hoverEffect?: boolean;
}

export default function Card({
    children,
    className,
    variant = 'glass',
    hoverEffect = true,
    ...props
}: CardProps) {
    return (
        <motion.div
            initial={hoverEffect ? { y: 0 } : undefined}
            whileHover={hoverEffect ? { y: -5 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                "rounded-xl border p-6 overflow-hidden relative",
                variant === 'glass' ? "glass-card" : "bg-card text-card-foreground shadow-lg border-white/10",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
