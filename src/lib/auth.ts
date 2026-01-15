import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import User from '@/models/User';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: 'admin' | 'user';
            isOnboarded: boolean;
        } & DefaultSession['user'];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Phone OTP',
            credentials: {
                phone: { label: "Phone Number", type: "text" },
                otp: { label: "OTP", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.otp) {
                    throw new Error('Please enter both phone number and OTP');
                }

                // Demo Mode Check (from env)
                const isDemo = process.env.DEMO_MODE === 'true';
                const demoOtp = process.env.DEMO_OTP || '123456';

                if (isDemo && credentials.otp !== demoOtp) {
                    throw new Error('Invalid OTP code');
                }

                // Connect to DB
                await dbConnect();

                // Find or create user
                let user = await User.findOne({ phone: credentials.phone });

                if (!user) {
                    user = await User.create({
                        phone: credentials.phone,
                        credits: 50,
                        isOnboarded: false
                    });
                }

                return {
                    id: user._id.toString(),
                    name: user.name || credentials.phone,
                    email: null,
                    image: null,
                    isOnboarded: user.isOnboarded,
                    role: user.isAdmin ? 'admin' : 'user',
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.isOnboarded = (user as any).isOnboarded;
            }
            if (trigger === "update" && session?.isOnboarded) {
                token.isOnboarded = session.isOnboarded;
                token.name = session.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'admin' | 'user';
                session.user.isOnboarded = token.isOnboarded as boolean;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/onboarding'
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
