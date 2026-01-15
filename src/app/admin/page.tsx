'use client';

import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
            <div className="container max-w-4xl mx-auto">
                <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
                <h1 className="heading-1 mb-6">Admin Panel 🛡️</h1>

                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-8 border border-yellow-200">
                    <p><strong>Note:</strong> In a production app, this route would be protected by middleware checking for <code>role: 'admin'</code>.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-2">Users</h2>
                        <p className="text-muted mb-4">Manage user accounts and credits.</p>
                        <button className="btn btn-outline w-full" disabled>Coming Soon</button>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-2">Transactions</h2>
                        <p className="text-muted mb-4">View all credit transfers.</p>
                        <button className="btn btn-outline w-full" disabled>Coming Soon</button>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold mb-2">Content</h2>
                        <p className="text-muted mb-4">Moderate classes and tasks.</p>
                        <button className="btn btn-outline w-full" disabled>Coming Soon</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
