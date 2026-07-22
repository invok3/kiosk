import { CartProvider } from "@/app/context/cart-context";

export default function CustomerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}