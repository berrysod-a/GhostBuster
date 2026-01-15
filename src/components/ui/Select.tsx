'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-500 focus-visible:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        <option value="" disabled className="bg-slate-900 text-gray-500">Select an option</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
                {error && (
                    <p className="text-xs text-red-400 ml-1">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

export default Select;
