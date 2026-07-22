"use client";

import { useState } from "react";
import CategoryAccordion from "@/app/ui/category-accordion";
import ProductOptionModal from "@/app/ui/product-option-modal";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/context/cart-context";
import MenuHeader from "@/app/ui/menu-header";
import Link from "next/link";

export const MOCK_CATEGORIES = [
  {
    id: "hot-drinks",
    title: "مشروبات ساخنة",
    products: [
      {
        id: "1",
        name: "إسبريسو",
        price: 12.0,
        options: [
          // 1. Radio Option (Single Choice)
          {
            id: "milk_type",
            title: "نوع الحليب",
            type: "radio",
            required: true,
            choices: [
              { id: "whole_milk", name: "حليب كامل الدسم", extraPrice: 0 },
              { id: "oat_milk", name: "حليب شوفان", extraPrice: 3.0 },
              { id: "almond_milk", name: "حليب لوز", extraPrice: 3.0 },
            ],
          },
          // 2. Free Boolean Option
          {
            id: "extra_hot",
            title: "ساخن جداً",
            type: "checkbox",
            extraPrice: 0,
          },
          // 3. Paid Boolean Option
          {
            id: "extra_shot",
            title: "جرعة إضافية (Extra Shot)",
            type: "checkbox",
            extraPrice: 4.0,
          },
        ],
      },
      { id: "2", name: "لاتيه", price: 18.0 },
      { id: "3", name: "كابتشينو", price: 16.0 },
      { id: "4", name: "أمريكانو", price: 14.0 },
    ],
  },
  {
    id: "soft-drinks",
    title: "مشروبات باردة",
    products: [
      { id: "5", name: "آيس لاتيه", price: 20.0 },
      { id: "6", name: "آيس أمريكانو", price: 15.0 },
      { id: "7", name: "كولد برو", price: 22.0 },
      { id: "8", name: "موهيتو ليمون ونعناع", price: 17.0 },
    ],
  },
];

export default function Menu() {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Consume global cart dispatch
  const { addToCart, totalAmount, itemCount } = useCart();

  const handleToggle = (categoryId: string) => {
    setOpenCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
          <div className="w-full flex flex-col landscape:w-[50vh] h-screen bg-cream-100 p-4">
            {/* Header receives live calculations directly from Root Context */}
            <MenuHeader totalAmount={totalAmount} itemCount={itemCount} />
    
            <main className="flex-1 overflow-y-auto my-2">

    <div className="py-2">
      <h2 className="text-xl font-bold text-coffee-900 mb-4 px-1">القائمة</h2>

      {MOCK_CATEGORIES.map((category) => (
        <CategoryAccordion
          key={category.id}
          title={category.title}
          products={category.products}
          isOpen={openCategoryId === category.id}
          onToggle={() => handleToggle(category.id)}
          onProductSelect={handleProductSelect}
        />
      ))}

      {/* Product Option Modal */}
      {selectedProduct && (
        <ProductOptionModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
    </main>

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