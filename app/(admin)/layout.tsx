import { DashboardProviders } from "@/app/context/dashboard-providers";


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardProviders>
            <div className="bg-white h-screen w-screen text-black">
                {children}
            </div>
        </DashboardProviders>
    );
}


