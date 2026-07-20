
import Link from "next/link";

interface MenuHeaderProps {
    totalAmount?: number;
    itemCount?: number;
}


export default function MenuHeader({
    totalAmount = 0,
    itemCount = 0
}: MenuHeaderProps) {
    return (
        <header className="flex items-center justify-between py-3 px-1 border-b border-coffee-200/40 mb-4">

            {/* 1. Start: Cart Icon with Badge */}
            <Link
                href="/cart"
                className="relative p-2.5 bg-cream-200 rounded-full text-coffee-800 hover:bg-cream-300 active:scale-95 transition-all"
                aria-label="السلة"
            >
                {/* Shopping Bag Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>

                {/* Item Counter Badge */}
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-coffee-800 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                        {itemCount}
                    </span>
                )}
            </Link>

            {/* 2. Center: Total Amount */}
            <div className="text-center">
                <span className="text-s text-coffee-500 font-medium block">
                    المجموع
                </span>
                <span className="text-lg font-bold text-coffee-900">
                    {totalAmount.toFixed(2)} ₪
                </span>
            </div>

            {/* 3. End: Invisible Balancer */}
            {/* Keeps the center text perfectly centered in the flexbox header */}
            <div className="w-11" aria-hidden="true" />

        </header>
    );
}