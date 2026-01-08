"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config"; // To get ID token

export default function UserList() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error("API Error:", res.status, res.statusText, errBody);
                return;
            }

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (data.users) {
                    setUsers(data.users);
                }
            } else {
                console.error("Received non-JSON response from API");
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusUpdate = async (uid: string, newStatus: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ uid, status: newStatus })
            });
            // Optimistic update or refetch
            fetchUsers();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleTogglePermission = async (uid: string, permissions: any, key: string) => {
        const newPermissions = { ...permissions, [key]: !permissions[key] };
        try {
            const token = await auth.currentUser?.getIdToken();
            await fetch("/api/admin/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ uid, permissions: newPermissions })
            });
            fetchUsers();
        } catch (error) {
            console.error("Update failed", error);
        }
    }

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 text-gray-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Permissions</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map((user) => (
                            <tr key={user.uid} className="hover:bg-zinc-900/50">
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${user.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                                        user.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {/* Example Permission Toggles */}
                                        <button
                                            onClick={() => handleTogglePermission(user.uid, user.permissions, 'captionGen')}
                                            className={`px-2 py-0.5 border rounded text-xs ${user.permissions?.captionGen ? 'bg-white text-black border-white' : 'text-gray-500 border-zinc-700'}`}
                                        >
                                            Caption
                                        </button>
                                        <button
                                            onClick={() => handleTogglePermission(user.uid, user.permissions, 'trendDashboard')}
                                            className={`px-2 py-0.5 border rounded text-xs ${user.permissions?.trendDashboard ? 'bg-white text-black border-white' : 'text-gray-500 border-zinc-700'}`}
                                        >
                                            Trend
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    {user.status === 'pending' && (
                                        <>
                                            <Button size="sm" onClick={() => handleStatusUpdate(user.uid, 'approved')} className="h-7 text-xs bg-white text-black hover:bg-gray-200">Approve</Button>
                                            <Button size="sm" onClick={() => handleStatusUpdate(user.uid, 'disabled')} variant="outline" className="h-7 text-xs border-zinc-600">Reject</Button>
                                        </>
                                    )}
                                    {user.status === 'approved' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(user.uid, 'disabled')} variant="outline" className="h-7 text-xs text-red-400 border-red-900 hover:bg-red-900/20">Disable</Button>
                                    )}
                                    {user.status === 'disabled' && (
                                        <Button size="sm" onClick={() => handleStatusUpdate(user.uid, 'approved')} variant="outline" className="h-7 text-xs">Re-enable</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
