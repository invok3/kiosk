import { CustomerProviders } from "@/app/context/customer-providers";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CustomerProviders>
            {children}
        </CustomerProviders>
    );
}
