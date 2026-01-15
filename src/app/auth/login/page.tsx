'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

            setStep('OTP');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                phone: phoneNumber,
                otp: otp,
                redirect: false,
            });

            if (res?.error) {
                throw new Error(res.error);
            }

            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            UniCredit
                        </span>
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-muted-foreground">The marketplace for academic excellence.</p>
                </div>

                <Card variant="glass" className="p-8 backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {step === 'PHONE' ? 'Sign In' : 'Verify OTP'}
                    </h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm border border-red-500/20 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                                size="lg"
                            >
                                Send Code
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-400">
                                    Code sent to <span className="text-white font-medium">{phoneNumber}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStep('PHONE')}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline mt-2 transition-colors"
                                >
                                    Change Number
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="• • • • • •"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-center tracking-[0.5em] text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Demo Code: <span className="font-mono text-gray-400">123456</span>
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={loading}
                                size="lg"
                            >
                                Verify & Login
                            </Button>
                        </form>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
