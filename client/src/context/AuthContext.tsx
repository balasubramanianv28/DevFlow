import { useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./auth-context";
import type { User } from "./auth-context";

interface AuthProviderProps {
    children: ReactNode;
}

const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem(
        "devflow_user"
    );

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as User;
    } catch {
        localStorage.removeItem("devflow_user");
        return null;
    }
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(
        () => {
            return localStorage.getItem(
                "devflow_token"
            );
        }
    );

    const [user, setUser] = useState<User | null>(
        () => {
            return getStoredUser();
        }
    );

    const login = (
        newToken: string,
        newUser: User
    ) => {
        localStorage.setItem(
            "devflow_token",
            newToken
        );

        localStorage.setItem(
            "devflow_user",
            JSON.stringify(newUser)
        );

        setToken(newToken);
        setUser(newUser);
    };

    const updateUser = (updatedUser: User) => {
        localStorage.setItem(
            "devflow_user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem("devflow_token");
        localStorage.removeItem("devflow_user");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(
        token && user
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                login,
                updateUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};  