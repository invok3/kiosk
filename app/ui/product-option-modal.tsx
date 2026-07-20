"use client";

import { useState, useMemo } from "react";
import { Product, CartProduct, cartProductFrom } from "@/app/types/product";

interface ProductOptionModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (cartProduct: CartProduct) => void;
}

export default function ProductOptionModal({
  product,
  onClose,
  onAddToCart,
}: ProductOptionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Track radio selections: { "milk_type": { id: "whole_milk", name: "حليب كامل الدسم", extraPrice: 0 } }
  const [selectedRadios, setSelectedRadios] = useState<Record<string, any>>(() => {
    if (!product?.options) return {};
    const initialRadios: Record<string, any> = {};
    
    product.options.forEach((optGroup) => {
      if (optGroup.type === "radio" && optGroup.choices?.length > 0) {
        // Default to first choice
        initialRadios[optGroup.id] = optGroup.choices[0];
      }
    });
    return initialRadios;
  });

  // Track checkbox toggles: { "extra_shot": { id: "extra_shot", name: "جرعة إضافية", extraPrice: 4.0 } }
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Record<string, any>>({});

  if (!product) return null;

  // Combine selected radios and active checkboxes into a flat list for `cartProductFrom`
  const flatSelectedOptions = useMemo(() => {
    const radioList = Object.values(selectedRadios);
    const checkboxList = Object.values(selectedCheckboxes);
    return [...radioList, ...checkboxList];
  }, [selectedRadios, selectedCheckboxes]);

  // Dynamic price preview via single-source-of-truth factory
  const currentTotal = cartProductFrom({
    product,
    quantity,
    options: flatSelectedOptions,
    note,
  }).total;

  const handleRadioSelect = (groupId: string, choice: any) => {
    setSelectedRadios((prev) => ({
      ...prev,
      [groupId]: choice,
    }));
  };

  const handleCheckboxToggle = (optGroup: any) => {
    setSelectedCheckboxes((prev) => {
      const copy = { ...prev };
      if (copy[optGroup.id]) {
        delete copy[optGroup.id];
      } else {
        copy[optGroup.id] = {
          id: optGroup.id,
          name: optGroup.title,
          extraPrice: optGroup.extraPrice || 0,
        };
      }
      return copy;
    });
  };

  const handleConfirm = () => {
    const item = cartProductFrom({
      product,
      quantity,
      options: flatSelectedOptions,
      note,
    });

    onAddToCart(item);
    onClose();
  };

  return (
    /* Dimmed Backdrop */
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      {/* Modal Surface: Solid Cream-100 */}
      <div
        className="w-full max-w-md bg-cream-100 text-coffee-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-coffee-500/20 flex flex-col max-h-[85vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-coffee-500/20">
          <div>
            <h3 className="text-xl font-bold text-coffee-900 leading-tight">
              {product.name}
            </h3>
            <p className="text-base font-bold text-coffee-500 mt-1">
              {product.price.toFixed(2)} ₪
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-cream-200 hover:bg-coffee-500/10 text-coffee-900 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-coffee-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Dynamic Options Section */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-4 pb-2">
              {product.options.map((optGroup) => {
                // 1. Radio Group (Single Choice)
                if (optGroup.type === "radio") {
                  const activeChoice = selectedRadios[optGroup.id];

                  return (
                    <div key={optGroup.id} className="space-y-2">
                      <label className="block text-sm font-bold text-coffee-900">
                        {optGroup.title}
                      </label>
                      <div className="space-y-1.5">
                        {optGroup.choices?.map((choice: any) => {
                          const isSelected = activeChoice?.id === choice.id;
                          return (
                            <button
                              key={choice.id}
                              type="button"
                              onClick={() =>
                                handleRadioSelect(optGroup.id, choice)
                              }
                              className={`w-full flex justify-between items-center p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? "border-coffee-800 bg-cream-200 text-coffee-900 font-bold"
                                  : "border-coffee-500/20 bg-white text-coffee-900 hover:bg-cream-200/50"
                              }`}
                            >
                              <span>{choice.name}</span>
                              <span className="text-xs font-bold text-coffee-500">
                                {choice.extraPrice > 0
                                  ? `+${choice.extraPrice.toFixed(2)} ₪`
                                  : "-"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // 2. Checkbox Group (Boolean / Toggle Option)
                if (optGroup.type === "checkbox") {
                  const isChecked = Boolean(selectedCheckboxes[optGroup.id]);

                  return (
                    <button
                      key={optGroup.id}
                      type="button"
                      onClick={() => handleCheckboxToggle(optGroup)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        isChecked
                          ? "border-coffee-800 bg-cream-200 text-coffee-900 font-bold"
                          : "border-coffee-500/20 bg-white text-coffee-900 hover:bg-cream-200/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-colors ${
                            isChecked
                              ? "bg-coffee-800 border-coffee-800 text-cream-100 font-bold"
                              : "border-coffee-500/40 bg-white"
                          }`}
                        >
                          {isChecked && "✓"}
                        </span>
                        <span>{optGroup.title}</span>
                      </div>
                      <span className="text-xs font-bold text-coffee-500">
                        {optGroup.extraPrice > 0
                          ? `+${optGroup.extraPrice.toFixed(2)} ₪`
                          : "-"}
                      </span>
                    </button>
                  );
                }

                return null;
              })}
            </div>
          )}

          {/* Note Input */}
          <div>
            <label className="block text-sm font-bold text-coffee-900 mb-2">
              ملاحظات خاصة
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: بدون سكر، حليب قليل الدسم..."
              className="w-full p-3 rounded-xl border border-coffee-500/30 bg-white text-coffee-900 placeholder:text-coffee-500/60 focus:outline-none focus:border-coffee-800 text-sm font-medium shadow-xs"
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex justify-between items-center py-3 border-t border-coffee-500/20">
            <span className="font-bold text-coffee-900 text-base">الكمية</span>
            <div className="flex items-center gap-3 bg-cream-200 rounded-xl p-1.5 border border-coffee-500/10">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-coffee-900 font-bold text-lg shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                -
              </button>
              <span className="font-bold text-coffee-900 w-6 text-center text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-coffee-900 font-bold text-lg shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Main CTA */}
        <div className="pt-4 border-t border-coffee-500/20">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 bg-coffee-800 hover:bg-coffee-900 text-cream-100 font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex justify-between items-center text-base cursor-pointer"
          >
            <span>إضافة إلى السلة</span>
            <span className="font-extrabold text-accent">
              {currentTotal.toFixed(2)} ₪
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}