import UserList from "@/components/dashboard/UserList";

export default function AdminPage() {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400">Manage users and platform settings.</p>
            </div>

            <UserList />
        </div>
    );
}
