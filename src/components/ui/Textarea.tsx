'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-300 ml-1">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        "flex min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground shadow-sm transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-400 ml-1">{error}</p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

export default Textarea;
