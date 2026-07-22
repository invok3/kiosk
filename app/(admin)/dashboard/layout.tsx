"use client";

import { useAuth } from "@/app/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
}