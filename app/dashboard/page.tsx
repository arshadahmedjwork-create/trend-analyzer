"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin';

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-sm md:text-base text-gray-400">Welcome back to the Trend Analyzer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Quick Action: Generate */}
                <div className="p-4 md:p-6 border border-zinc-900 rounded-lg bg-zinc-950 hover:border-zinc-700 transition-colors">
                    <h3 className="text-lg md:text-xl font-bold mb-2">Caption Generator</h3>
                    <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">Create viral captions using multi-model AI analysis.</p>
                    <Link href="/dashboard/generate">
                        <Button className="w-full bg-white text-black hover:bg-gray-200">Start Generating</Button>
                    </Link>
                </div>

                {/* Quick Action: Trends */}
                <div className="p-4 md:p-6 border border-zinc-900 rounded-lg bg-zinc-950 hover:border-zinc-700 transition-colors">
                    <h3 className="text-lg md:text-xl font-bold mb-2">Trend Analysis</h3>
                    <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">See what's trending on Instagram right now.</p>
                    <Link href="/dashboard/trend">
                        <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-white">View Trends</Button>
                    </Link>
                </div>

                {/* Admin Widget (conditional) */}
                {isAdmin && (
                    <div className="p-4 md:p-6 border border-zinc-900 rounded-lg bg-zinc-950 hover:border-zinc-700 transition-colors">
                        <h3 className="text-lg md:text-xl font-bold mb-2">Admin Controls</h3>
                        <p className="text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">Manage users, approvals, and system settings.</p>
                        <Link href="/dashboard/admin">
                            <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-white">Go to Admin</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
