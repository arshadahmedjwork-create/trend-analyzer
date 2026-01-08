"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/user";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create initial profile with 'pending' status
            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || "",
                role: "user",
                status: "pending",
                createdAt: Date.now(),
                permissions: {
                    trendDashboard: false,
                    captionGen: false,
                    imageAnalysis: false,
                    audioAnalysis: false,
                },
            };

            await setDoc(doc(db, "users", user.uid), newProfile);

            // Redirect to a waiting page or dashboard that handles pending state
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
            <div className="w-full max-w-sm space-y-8">
                <div className="flex flex-col items-center">
                    <div className="relative h-16 w-48 mb-6">
                        <Image
                            src="/logo.png"
                            alt="Trend Analyzer Logo"
                            fill
                            className="object-contain invert"
                            priority
                        />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Request Platform Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Account requires admin approval
                    </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-black border-white/20 focus:border-white"
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-black border-white/20 focus:border-white"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                        Submit Request
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
