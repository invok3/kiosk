"use client";

import ProductTile from "@/app/ui/product-tile";
import { Product } from "@/app/types/product";

interface CategoryAccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

export default function CategoryAccordion({
  title,
  isOpen,
  onToggle,
  products,
  onProductSelect,
}: CategoryAccordionProps) {
  return (
    <div className="mb-3 border border-coffee-200/60 rounded-2xl bg-cream-50 overflow-hidden transition-all shadow-sm">
      
      {/* Category Toggle Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center text-right font-bold text-lg text-coffee-900 bg-cream-200/50 hover:bg-cream-200 transition-colors cursor-pointer"
      >
        <span>{title}</span>
        
        {/* Chevron Icon that rotates when open */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-5 h-5 text-coffee-800 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Expanded Products List */}
      {isOpen && (
        <div className="p-3 divide-y divide-coffee-200/30">
          {products.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              onClick={onProductSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}