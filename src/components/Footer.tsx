'use client';

import { Phone, Mail, MapPin, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-white/10 glass-dark mt-auto">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            UniCredit
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Empowering students to learn, earn, and grow together. The marketplace for academic excellence.
                        </p>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Us</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-indigo-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-400" />
                                <span>support@unicredit.edu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                <span>123 University Ave, Tech City</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-indigo-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-pink-400 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} UniCredit. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
