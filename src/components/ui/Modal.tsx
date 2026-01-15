'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "w-full max-w-lg overflow-hidden rounded-2xl glass-card",
                                "bg-[#0f1115]/90 border border-white/10 shadow-2xl"
                            )}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 text-gray-300">
                                {children}
                            </div>

                            {footer && (
                                <div className="flex items-center justify-end gap-3 p-6 pt-0">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
