"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (profile) {
                if (profile.status === 'disabled') {
                    // Ideally redirect to a disabled page or show message
                    // For now, keep them on dashboard but show overlay? 
                    // Better to block.
                }
            }
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    if (!user || !profile) {
        return null; // Will redirect
    }

    if (profile.status === 'disabled') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
                <h1 className="text-xl md:text-2xl font-bold text-red-500">Account Disabled</h1>
                <p className="mt-2 text-sm md:text-base text-gray-400">Please contact support.</p>
                <Button onClick={() => auth.signOut()} className="mt-4" variant="outline">Sign Out</Button>
            </div>
        )
    }

    if (profile.status === 'pending') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
                <div className="relative h-12 md:h-16 w-36 md:w-48 mb-6">
                    <Image
                        src="/logo.png"
                        alt="Trend Analyzer Logo"
                        fill
                        className="object-contain invert"
                        priority
                    />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-center">You're on the Waitlist</h1>
                <p className="mt-2 text-sm md:text-base text-gray-400 text-center max-w-md px-4">
                    Thank you for signing up! Access to the Trend Analyzer is currently restricted.
                    <br /><br />
                    Once an admin reviews and approves your account, you will automatically gain access to the dashboard features.
                </p>
                <div className="mt-8">
                    <Button onClick={() => auth.signOut()} variant="outline" className="text-white border-white hover:bg-zinc-800">
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    const isAdmin = profile.role === 'admin';

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 p-4 flex items-center justify-between">
                <div className="relative h-8 w-24">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain invert" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40
                w-64 border-r border-zinc-800 bg-black p-6 flex flex-col
                transform transition-transform duration-200 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="relative h-12 w-36 mb-8 hidden md:block">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain invert"
                    />
                </div>

                <nav className="flex-1 space-y-2 mt-16 md:mt-0">
                    <Link
                        href="/dashboard"
                        className={`block px-4 py-2 rounded-md text-sm md:text-base ${pathname === '/dashboard' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        Overview
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/dashboard/admin"
                            className={`block px-4 py-2 rounded-md text-sm md:text-base ${pathname.startsWith('/dashboard/admin') ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            Admin Panel
                        </Link>
                    )}
                    {profile.permissions.captionGen && (
                        <Link
                            href="/dashboard/generate"
                            className={`block px-4 py-2 rounded-md text-sm md:text-base ${pathname.startsWith('/dashboard/generate') ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            Generate Caption
                        </Link>
                    )}
                    <Link
                        href="/dashboard/trend"
                        className={`block px-4 py-2 rounded-md text-sm md:text-base ${pathname.startsWith('/dashboard/trend') ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        Trend Analysis
                    </Link>

                    <div className="pt-4 border-t border-zinc-800 mt-4">
                        <Link
                            href="/support"
                            className="block px-4 py-2 rounded-md text-sm md:text-base text-gray-400 hover:text-white hover:bg-zinc-900"
                            onClick={() => setSidebarOpen(false)}
                        >
                            ☕ Support Us
                        </Link>
                    </div>
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-800">
                    <div className="text-xs md:text-sm text-gray-500 mb-2 truncate">{user.email}</div>
                    <Button
                        onClick={() => auth.signOut()}
                        variant="ghost"
                        className="w-full justify-start pl-0 hover:bg-transparent hover:text-red-500 text-gray-400 text-sm md:text-base"
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pt-16 md:pt-0">
                {children}
            </main>
        </div>
    );
}
