import { createContext } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (
        token: string,
        user: User
    ) => void;
    updateUser: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);