import AuthProvider from "@/app/context/auth-provider";


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className="bg-white h-screen w-screen text-black">
                {children}
            </div>
        </AuthProvider>
    );
}


