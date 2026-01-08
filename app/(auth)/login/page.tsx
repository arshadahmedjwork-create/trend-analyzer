"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user profile exists
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Create new profile if first time
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
                await setDoc(docRef, newProfile);
            }

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
            <div className="w-full max-w-sm space-y-8 text-center">
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
                        Sign in to your account
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">
                        Access is restricted to approved members only.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black hover:bg-gray-200 h-12 flex items-center justify-center gap-2"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    );
}
