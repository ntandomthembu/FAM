import { UserRole } from './enums';

export interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    phone?: string;
    role: UserRole;
    farmIds: string[];
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRegistration {
    username: string;
    password: string;
    email: string;
    phone?: string;
    role: UserRole;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface AuthToken {
    token: string;
    expiresIn: number;
    userId: string;
    role: UserRole;
}