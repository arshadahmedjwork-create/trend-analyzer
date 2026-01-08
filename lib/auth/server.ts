import { headers } from "next/headers";
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { UserProfile } from "@/types/user";

let adminApp: App;

if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccount) {
        console.error("[DEBUG] FIREBASE_SERVICE_ACCOUNT_JSON is MISSING");
        throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required");
    }

    try {
        const serviceAccountJSON = JSON.parse(serviceAccount);
        
        adminApp = initializeApp({
            credential: cert(serviceAccountJSON)
        });
        
        console.log("[DEBUG] Firebase Admin initialized successfully");
    } catch (error) {
        console.error("[DEBUG] Failed to parse service account JSON:", error);
        throw error;
    }
} else {
    adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

export async function verifyAuth() {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        throw new Error("Unauthorized: No token provided");
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new Error("Unauthorized: Invalid token");
    }
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
    const doc = await adminDb.collection("users").doc(uid).get();
    if (!doc.exists) {
        throw new Error("User profile not found");
    }
    return doc.data() as UserProfile;
}

export async function requireAdmin() {
    const decoded = await verifyAuth();
    const profile = await getUserProfile(decoded.uid);

    if (profile.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    return profile;
}

export async function requireApproval() {
    const decoded = await verifyAuth();
    const profile = await getUserProfile(decoded.uid);

    if (profile.status !== "approved") {
        // Allow admin even if pending? No, usually admins are approved. 
        // But if an admin sets themselves to pending? Edge case.
        // We assume Approved status is required for API usage for regular users.
        // Admins bypass approval check? Or just enforce approved for everyone.
        // Let's enforce approved.
        if (profile.role !== "admin") {
            throw new Error("Forbidden: Account pending approval");
        }
    }

    return profile;
}
