'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 border border-indigo-500",
        secondary: "bg-white text-indigo-900 hover:bg-gray-50 border border-gray-200 shadow-sm",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
        ghost: "bg-transparent text-indigo-300 hover:text-white hover:bg-white/5",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-6 py-3.5 text-lg"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ translateY: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props as any}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
