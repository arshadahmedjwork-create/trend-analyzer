import "server-only";
// Force rebuild to clear cache
import { initializeApp, getApps, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// You can load service account from env or file. 
// For this setup, we'll try to use Google Application Default Credentials 
// or basic env vars if the user provides the private key directly.
// Given the prompt "Load from .env", we'll check for FIREBASE_SERVICE_ACCOUNT_KEY or generic creds.

// Ideally, for production SaaS, use proper service account JSON content or path.
// We will placeholder this to rely on standard initialization (requires GOOGLE_APPLICATION_CREDENTIALS) or explicit params if added.

const initAdmin = () => {
    if (getApps().length) {
        return getApp();
    }

    let credential;
    try {
        const jsonVar = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        console.log(`[DEBUG] FIREBASE_SERVICE_ACCOUNT_JSON is ${jsonVar ? "PRESENT" : "MISSING"}`);
        if (jsonVar) {
            console.log(`[DEBUG] Length: ${jsonVar.length}, First char: '${jsonVar[0]}'`);
            // Attempt cleanup if the user pasted it with surrounding quotes or whitespace
            let cleanJson = jsonVar.trim();
            if (cleanJson.startsWith('"') && cleanJson.endsWith('"')) {
                cleanJson = cleanJson.slice(1, -1);
                // Handle escaped newlines if they exist
                cleanJson = cleanJson.replace(/\\n/g, '\n');
            }

            const serviceAccount = JSON.parse(cleanJson);
            console.log("[DEBUG] JSON Parse Successful. Project ID:", serviceAccount.project_id);
            credential = cert(serviceAccount);
        }
    } catch (e: any) {
        console.error("[DEBUG] FAILED to parse FIREBASE_SERVICE_ACCOUNT_JSON.", e.message);
        // Do not throw, let it fall through to "no-credential" logic which might use ADC
    }

    const config: any = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    };
    if (credential) {
        config.credential = credential;
    }
    return initializeApp(config);
};

// We export proxies that initialize on first use


// A safer way: export getting function or use a singleton pattern that might throw on access
let _adminAuth: any;
let _adminDb: any;

function getAdminAuth() {
    if (!_adminAuth) {
        const app = initAdmin();
        _adminAuth = getAuth(app);
    }
    return _adminAuth;
}

function getAdminDb() {
    if (!_adminDb) {
        const app = initAdmin();
        _adminDb = getFirestore(app);
    }
    return _adminDb;
}

export const firebaseAdminAuth = new Proxy({}, {
    get: (_, prop) => {
        return (getAdminAuth() as any)[prop];
    }
}) as import("firebase-admin/auth").Auth;

export const firebaseAdminDb = new Proxy({}, {
    get: (_, prop) => {
        return (getAdminDb() as any)[prop];
    }
}) as import("firebase-admin/firestore").Firestore;
