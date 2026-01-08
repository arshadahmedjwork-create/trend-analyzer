export type UserRole = 'admin' | 'user';
export type UserStatus = 'pending' | 'approved' | 'disabled';

export interface UserPermissions {
    trendDashboard: boolean;
    captionGen: boolean;
    imageAnalysis: boolean;
    audioAnalysis: boolean;
}

export interface UserProfile {
    uid: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    permissions: UserPermissions;
    createdAt: number;
}
