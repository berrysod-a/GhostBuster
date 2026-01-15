import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniCredit - Student Marketplace',
  description: 'A credit-based marketplace for students to learn and earn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen relative overflow-x-hidden antialiased selection:bg-primary selection:text-white")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
