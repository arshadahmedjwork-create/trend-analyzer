"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/types/user";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchProfile(firebaseUser.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchProfile = async (uid: string) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            } else {
                // Handle case where auth exists but profile doesn't (legacy or partial signup)
                setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, refreshProfile: async () => { if (user) await fetchProfile(user.uid); } }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
