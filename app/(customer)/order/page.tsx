"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/providers/cart-context";
import { placeOrder } from "@/app/lib/place-order";

type OrderType = "pickup" | "delivery";

export default function OrderPage() {
  // 1. MUST be initialized at the very top of the hook block
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!customer.name || !customer.phone) return;
  //   if (orderType === "delivery" && !customer.address) return;

  //   setIsSubmitting(true);

  //   setTimeout(() => {
  //     setIsSubmitting(false);
  //     setIsSubmitted(true);
  //     clearCart();
  //   }, 1000);
  // };

      // Your WhatsApp phone number in international format without '+' or spaces (e.g., 972... or 970...)
    const SHOP_PHONE_NUMBER = "972595202527";

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!customer.name || !customer.phone) return;
      if (orderType === "delivery" && !customer.address) return;

      setIsSubmitting(true);

      // 1. Write order to Firestore
      await placeOrder({
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: orderType === "delivery" ? customer.address : "",
        customerNotes: customer.notes || "",
        type: orderType,
        items: cart,
        total: totalAmount,
        date: new Date().toISOString(),
      });

      // 2. Format order items list
      const itemsList = cart
        .map((item) => {
          let line = `• ${item.label} (${item.quantity}x) - ${(item.price * item.quantity).toFixed(2)} ₪`;
          if (item.options && item.options.length > 0) {
            const optionsList = item.options
              .map((opt) => {
                const extra = opt.extraPrice ?? 0;
                const priceStr = extra > 0 ? ` (+${extra.toFixed(2)} ₪)` : "";
                return `    ◦ ${opt.name}${priceStr}`;
              })
              .join("\n");
            line += "\n" + optionsList;
          }
          if (item.note) {
            line += `\n    ملاحظة: ${item.note}`;
          }
          return line;
        })
        .join("\n");

      // 2. Build structured WhatsApp message text
      const message = `*طلب جديد - قهوة vintage*
--------------------------------
*نوع الطلب:* ${orderType === "pickup" ? "استلام من الفرع" : "توصيل"}

*بيانات الزبون:*
• *الاسم:* ${customer.name}
• *الهاتف:* ${customer.phone}
${orderType === "delivery" ? `• *العنوان:* ${customer.address}\n` : ""}${customer.notes ? `• *ملاحظات:* ${customer.notes}\n` : ""
        }
--------------------------------
*تفاصيل الطلب:*
${itemsList}

--------------------------------
*المجموع الكلي:* ${totalAmount.toFixed(2)} ₪`;

      // 3. Create encoded wa.me URL
      const whatsappUrl = `https://wa.me/${SHOP_PHONE_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

      // 4. Clear cart & redirect to WhatsApp
      clearCart();
      setIsSubmitting(false);

      // Open directly in browser/app
      window.location.href = whatsappUrl;
    };

  // 2. Early return comes strictly AFTER hooks initialization
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full flex flex-col landscape:w-[50vh] h-screen bg-cream-100 p-6 justify-center items-center text-center">
          <div className="border border-coffee-800 p-6 rounded-2xl w-full max-w-xs space-y-3">
            <h1 className="text-2xl font-bold text-coffee-900 border-b border-coffee-800/20 pb-3">
              تم استلام طلبك
            </h1>
            <p className="text-sm text-coffee-900/80 leading-relaxed">
              شكرًا لك، {customer.name}.
              <br />
              {orderType === "pickup"
                ? "طلبك قيد التحضير وسيكون جاهزًا للاستلام قريبًا."
                : "طلبك قيد التحضير وسيصلك إلى عنوانك قريبًا."}
            </p>
          </div>
          <Link
            href="/menu"
            prefetch={false}
            className="w-full max-w-xs mt-6 py-4 bg-coffee-800 text-cream-100 font-bold rounded-2xl shadow-sm text-center block"
          >
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full flex flex-col landscape:w-[50vh] min-h-screen bg-cream-100 p-4">

        {/* Header */}
        <header className="flex items-center gap-3 py-3 border-b border-coffee-800/20">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-coffee-800 p-1 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="الرجوع للصفحة السابقة"
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
          </button>
          <h1 className="text-xl font-bold text-coffee-900 tracking-wide">
            بيانات الطلب
          </h1>
        </header>

        {/* Form Body */}
        <main className="flex-1 my-2 py-2">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-5">

            {/* Minimalist Toggle Switch */}
            <div className="border border-coffee-800/30 p-1 rounded-2xl flex text-sm font-bold bg-cream-100">
              <button
                type="button"
                onClick={() => setOrderType("pickup")}
                className={`flex-1 py-3 rounded-xl transition-all ${orderType === "pickup"
                    ? "bg-coffee-800 text-cream-100"
                    : "text-coffee-900/70 hover:text-coffee-900"
                  }`}
              >
                استلام من الفرع
              </button>
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`flex-1 py-3 rounded-xl transition-all ${orderType === "delivery"
                    ? "bg-coffee-800 text-cream-100"
                    : "text-coffee-900/70 hover:text-coffee-900"
                  }`}
              >
                توصيل
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-coffee-900 mb-1.5 uppercase tracking-wider">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل الاسم"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  className="w-full p-3.5 bg-cream-100 border border-coffee-800/30 rounded-xl text-coffee-900 placeholder:text-coffee-900/40 focus:outline-none focus:border-coffee-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-coffee-900 mb-1.5 uppercase tracking-wider">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="059XXXXXXX"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  className="w-full p-3.5 bg-cream-100 border border-coffee-800/30 rounded-xl text-coffee-900 placeholder:text-coffee-900/40 focus:outline-none focus:border-coffee-800 text-sm"
                  dir="ltr"
                />
              </div>

              {/* Conditional Delivery Address */}
              {orderType === "delivery" && (
                <div>
                  <label className="block text-xs font-bold text-coffee-900 mb-1.5 uppercase tracking-wider">
                    عنوان التوصيل *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="المدينة، الشارع، المعالم القريبة"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    className="w-full p-3.5 bg-cream-100 border border-coffee-800/30 rounded-xl text-coffee-900 placeholder:text-coffee-900/40 focus:outline-none focus:border-coffee-800 text-sm resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-coffee-900 mb-1.5 uppercase tracking-wider">
                  ملاحظات إضافية
                </label>
                <input
                  type="text"
                  placeholder="أي ملاحظات خاصة بالطلب"
                  value={customer.notes}
                  onChange={(e) =>
                    setCustomer({ ...customer, notes: e.target.value })
                  }
                  className="w-full p-3.5 bg-cream-100 border border-coffee-800/30 rounded-xl text-coffee-900 placeholder:text-coffee-900/40 focus:outline-none focus:border-coffee-800 text-sm"
                />
              </div>
            </div>

            {/* Total Receipt Summary */}
            <div className="border border-dashed border-coffee-800/40 p-4 rounded-xl space-y-2 text-sm mt-6">
              <div className="flex justify-between text-coffee-900/80 font-medium">
                <span>عدد العناصر:</span>
                <span>{cart.reduce((a, c) => a + c.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-coffee-900 font-bold text-base pt-2 border-t border-coffee-800/20">
                <span>المجموع الكلي:</span>
                <span>{totalAmount.toFixed(2)} ₪</span>
              </div>
            </div>
          </form>
        </main>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            form="order-form"
            disabled={isSubmitting || cart.length === 0}
            className="w-full py-4 bg-coffee-800 text-cream-100 text-lg font-bold rounded-2xl active:scale-[0.98] transition-transform text-center disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب"}
          </button>
        </div>
      </div>
    </div>
  );
}