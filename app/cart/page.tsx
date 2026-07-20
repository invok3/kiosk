"use client";

import Link from "next/link";
import { useCart } from "@/app/context/cart-context";

export default function CartPage() {
    const { cart, removeFromCart, totalAmount, clearCart } = useCart();

    return (
        <div className="min-h-screen flex justify-center items-center bg-cream-100">
            <div className="w-full flex flex-col landscape:w-[50vh] h-screen bg-cream-100 p-4">

                {/* Header */}
                <header className="flex justify-between items-center py-2 border-b border-coffee-800/10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/menu"
                            className="text-coffee-800 p-1 hover:opacity-80 transition-opacity"
                            aria-label="العودة للقائمة"
                        >
                            <svg
                                className="w-6 h-6 rtl:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-coffee-900">سلة التسوق</h1>
                    </div>

                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs text-red-600 font-semibold hover:underline"
                        >
                            تفريغ السلة
                        </button>
                    )}
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto my-2 space-y-3 py-2">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6">

                            <p className="text-coffee-900 font-bold text-lg">السلة فارغة</p>
                            <p className="text-coffee-900/60 text-sm mt-1">
                                لم تقم بإضافة أي طلبات
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-cream-100 border border-coffee-800/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-coffee-900 text-base">
                                            {item.name}
                                        </h3>
                                        <span className="text-xs text-coffee-800/70 font-semibold">
                                            الكمية: {item.quantity}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500/80 hover:text-red-600 font-bold text-sm p-1"
                                        aria-label="إزالة العنصر"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Options List */}
                                {item.options && item.options.length > 0 && (
                                    <div className="text-xs text-coffee-900/70 space-y-1 bg-coffee-800/5 p-2.5 rounded-xl">
                                        {item.options.map((opt, idx) => (
                                            <p key={idx}>• {opt.name || opt.title}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Notes */}
                                {item.note && (
                                    <p className="text-xs italic text-coffee-900/60">
                                        ملاحظة: "{item.note}"
                                    </p>
                                )}

                                {/* Price Item Total */}
                                <div className="flex justify-end pt-1 border-t border-coffee-800/10">
                                    <span className="font-bold text-coffee-900">
                                        {item.total.toFixed(2)} ₪
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </main>

                {/* Sticky Action Footer */}
                <div className="w-full flex flex-col items-center gap-3 pt-2">
                    {cart.length > 0 && (
                        <div className="w-full flex justify-between items-center px-2 text-coffee-900 font-bold">
                            <span>المجموع الكلي:</span>
                            <span className="text-xl">{totalAmount.toFixed(2)} ₪</span>
                        </div>
                    )}

                    {cart.length > 0 ? (
                        <Link
                            href="/order"
                            className="w-full max-w-[50vh] py-4 text-cream-100 text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all text-center block cursor-pointer bg-coffee-800 hover:bg-coffee-900"
                        >
                            إكمال الطلب
                        </Link>
                    ) : (
                        <Link
                            href="/menu"
                            className="w-full max-w-[50vh] py-4 bg-coffee-800 text-cream-100 text-lg font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-transform text-center block cursor-pointer"
                        >
                            العودة للقائمة
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}