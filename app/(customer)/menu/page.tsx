"use client";

import { useState } from "react";
import CategoryAccordion from "@/app/ui/category-accordion";
import ProductOptionModal from "@/app/ui/product-option-modal";
import { Product } from "@/app/types/product";
import { useCart } from "@/app/context/providers/cart-context";
import MenuHeader from "@/app/ui/menu-header";
import Link from "next/link";
import { useData } from "@/app/context/providers/menu-provider";

export default function Menu() {
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Consume global cart dispatch
  const { addToCart, totalAmount, itemCount } = useCart();
  const { categories, productsByCategory } = useData();

  const handleToggle = (categoryId: number) => {
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

      {categories.filter((cat) => cat.available).map((category) => (
        <CategoryAccordion
          key={category.id}
          title={category.label}
          products={productsByCategory(category.id).filter((p) => p.available)}
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