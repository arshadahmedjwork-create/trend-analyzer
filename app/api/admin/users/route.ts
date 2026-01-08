import { NextResponse } from "next/server";
import { firebaseAdminDb as adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/server";
import { UserProfile } from "@/types/user";

export async function GET() {
    try {
        // 1. Verify Admin
        await requireAdmin();

        // 2. Fetch all users from Firestore
        const snapshot = await adminDb.collection("users").get();
        const users: UserProfile[] = [];
        snapshot.forEach((doc) => {
            users.push(doc.data() as UserProfile);
        });

        return NextResponse.json({ users });
    } catch (error: any) {
        const isAuthError = error.message.includes("Unauthorized");
        const isForbidden = error.message.includes("Forbidden");
        const status = isAuthError ? 401 : (isForbidden ? 403 : 500);

        console.error(`[API Error] ${status}:`, error.message);

        return NextResponse.json(
            { error: error.message },
            { status }
        );
    }
}

export async function PUT(request: Request) {
    try {
        await requireAdmin();
        const { uid, status, permissions, role } = await request.json(); // Update payload

        if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

        const updateData: any = {};
        if (status) updateData.status = status;
        if (permissions) updateData.permissions = permissions;
        if (role) updateData.role = role;

        await adminDb.collection("users").doc(uid).update(updateData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
