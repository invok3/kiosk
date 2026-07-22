import { CartProvider } from "@/app/context/cart-context";

export default function MyAppLayout({
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