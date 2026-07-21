"use client";

import MenuHeader from "@/app/ui/menu-header";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { totalAmount, itemCount } = useCart();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full flex flex-col landscape:w-[50vh] h-screen bg-cream-100 p-4">
        {/* Header receives live calculations directly from Root Context */}
        <MenuHeader totalAmount={totalAmount} itemCount={itemCount} />

        <main className="flex-1 overflow-y-auto my-2">{children}</main>

        <div className="w-full flex justify-center">
          <Link
            href="/order"
            prefetch={false}
            className={`w-full max-w-[50vh] py-4 text-cream-100 text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all text-center block cursor-pointer ${
              itemCount > 0
                ? "bg-coffee-800 hover:bg-coffee-900"
                : "bg-coffee-800/50 pointer-events-none opacity-60"
            }`}
          >
            إكمال الطلب {itemCount > 0 ? `(${totalAmount.toFixed(2)} ₪)` : ""}
          </Link>
        </div>
      </div>
    </div>
  );
}