"use client";


import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useState } from "react";


interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    return (
        <AuthContext.Provider value={{
            user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}




export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}