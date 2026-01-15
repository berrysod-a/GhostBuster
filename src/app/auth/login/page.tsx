'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

            // Check onboarding status and redirect accordingly
            // We'll rely on the main page to redirect to onboarding if needed
            // or we can fetch the session to check

            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <div className="card max-w-md w-full glass">
                <div className="text-center mb-8">
                    <h1 className="heading-1 text-primary">UniCredit</h1>
                    <p className="text-muted">Learn, Earn, and Grow Together</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                className="input"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-sm text-muted">
                                Enter the code sent to <strong>{phoneNumber}</strong>
                            </p>
                            <button
                                type="button"
                                onClick={() => setStep('PHONE')}
                                className="text-xs text-primary hover:underline mt-1"
                            >
                                Change Number
                            </button>
                        </div>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium mb-1">
                                OTP Code
                            </label>
                            <input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                className="input text-center tracking-widest text-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                            <p className="text-xs text-muted mt-2 text-center">
                                Demo Code: 123456
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
