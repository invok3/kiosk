"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product } from "@/app/types/product";
import { ProductOption, OptionChoice } from "@/app/types/option";
import { useData, ProductWithCategory } from "@/app/context/providers/menu-provider";
import { useSearchFilter } from "@/app/hooks/use-search-filter";
import AdminSearchBar from "@/app/ui/admin-search-bar";

function shortId() {
  return Math.random().toString(36).slice(2, 10);
}

function ProductsContent() {
  const { categories, products, addProduct, updateProduct, deleteProduct } = useData();
  const { searchInput, setSearchInput, filterValue } = useSearchFilter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryFilterParam = searchParams.get("categoryid");
  const categoryFilter = categoryFilterParam !== null ? Number(categoryFilterParam) : null;

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("categoryid", value);
    } else {
      params.delete("categoryid");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    name: "",
    price: "",
    category_id: 0,
    available: true,
  });
  const [options, setOptions] = useState<ProductOption[]>([]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ label: "", name: "", price: "", category_id: categories[0]?.id ?? 0, available: true });
    setOptions([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductWithCategory) => {
    setEditingProduct(product);
    setFormData({
      label: product.label,
      name: product.name,
      price: String(product.price),
      category_id: product.category_id,
      available: product.available,
    });
    setOptions(product.options ? structuredClone(product.options) : []);
    setIsModalOpen(true);
  };

  const handleDelete = (product: ProductWithCategory) => {
    deleteProduct(product.id);
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (categoryFilter !== null) {
      result = result.filter((p) => p.category_id === categoryFilter);
    }
    if (filterValue) {
      const term = filterValue.toLowerCase();
      result = result.filter(
        (p) =>
          p.label.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term) ||
          p.categoryLabel.toLowerCase().includes(term),
      );
    }
    return result;
  }, [products, categoryFilter, filterValue]);

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: shortId(), name: "", type: "checkbox", extraPrice: 0, required: false, choices: [] },
    ]);
  };

  const handleRemoveOption = (optId: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== optId));
  };

  const handleOptionChange = (optId: string, updates: Partial<ProductOption>) => {
    setOptions((prev) =>
      prev.map((o) => {
        if (o.id !== optId) return o;
        const next = { ...o, ...updates };
        // Switching to radio: initialize 2 default choices, clear option cost
        if (updates.type === "radio" && o.type !== "radio") {
          next.extraPrice = 0;
          next.required = false;
          next.choices = [
            { id: shortId(), name: "", extraPrice: 0 },
            { id: shortId(), name: "", extraPrice: 0 },
          ];
        }
        // Switching to checkbox: clear choices
        if (updates.type === "checkbox" && o.type !== "checkbox") {
          next.choices = [];
          next.extraPrice = next.extraPrice ?? 0;
        }
        return next;
      }),
    );
  };

  const handleAddChoice = (optId: string) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? { ...o, choices: [...(o.choices ?? []), { id: shortId(), name: "", extraPrice: 0 }] }
          : o,
      ),
    );
  };

  const handleRemoveChoice = (optId: string, choiceId: string) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? { ...o, choices: (o.choices ?? []).filter((c) => c.id !== choiceId) }
          : o,
      ),
    );
  };

  const handleChoiceChange = (optId: string, choiceId: string, updates: Partial<OptionChoice>) => {
    setOptions((prev) =>
      prev.map((o) =>
        o.id === optId
          ? {
              ...o,
              choices: (o.choices ?? []).map((c) =>
                c.id === choiceId ? { ...c, ...updates } : c,
              ),
            }
          : o,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.name.trim() || !formData.price.trim()) return;

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum)) return;

    const cleanOptions = options.length > 0 ? options : [];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        label: formData.label.trim(),
        name: formData.name.trim(),
        price: priceNum,
        category_id: formData.category_id,
        options: cleanOptions,
        available: formData.available,
      });
    } else {
      const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: nextId,
        category_id: formData.category_id,
        label: formData.label.trim(),
        name: formData.name.trim(),
        price: priceNum,
        options: cleanOptions,
        available: true,
      };
      addProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-8 flex flex-col gap-6">
      {/* 1. Action Bar (Header) - Fixed height */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
        <div className="flex items-center gap-3">
          <AdminSearchBar value={searchInput} onChange={setSearchInput} />
          <select
            value={categoryFilterParam ?? ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-white border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
          >
            <option value="">الكل</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
        >
          إضافة منتج جديد
        </button>
      </div>

      {/* 2. Bounded Content Slot: Flex-1 + relative guarantees strict boundary */}
      <div className="flex-1 min-h-0 relative max-w-4xl">
        {/* 3. Absolute inset-0 forces inner div to strictly obey parent bounds without expanding it */}
        <div className="absolute inset-0 bg-white border border-stone-200 rounded-md overflow-y-auto">
          <table className="w-full text-right text-sm border-collapse">
            <thead className="sticky top-0 bg-stone-50 border-b border-stone-200 z-10">
              <tr className="text-stone-500 text-xs font-medium">
                <th className="py-3 px-6">المسمى (Label)</th>
                <th className="py-3 px-6">الاسم البرمجي (Name)</th>
                <th className="py-3 px-6">السعر</th>
                <th className="py-3 px-6">التصنيف</th>
                <th className="py-3 px-6">خيارات</th>
                <th className="py-3 px-6 text-center">متوفر</th>
                <th className="py-3 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-stone-900">{product.label}</td>
                  <td className="py-4 px-6 text-stone-500 font-mono text-xs">{product.name}</td>
                  <td className="py-4 px-6 text-stone-700">{product.price} ₪</td>
                  <td className="py-4 px-6 text-stone-600">{product.categoryLabel}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold ${
                      product.options && product.options.length > 0
                        ? "bg-stone-100 text-stone-700"
                        : "bg-stone-50 text-stone-400"
                    }`}>
                      {product.options ? product.options.length : 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={product.available}
                      onChange={() => updateProduct(product.id, { available: !product.available })}
                      className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer accent-stone-700"
                    />
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-4 text-xs font-semibold">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="text-stone-700 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-stone-400 hover:text-stone-900 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-xs">
                    لا توجد منتجات حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-stone-200 rounded-md max-w-sm w-full max-h-[85vh] flex flex-col shadow-xl">
            <div className="border-b border-stone-100 pb-3 px-6 pt-6">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    المسمى (Label)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: إسبريسو"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    الاسم البرمجي (Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: espresso"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    السعر (Price)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="مثال: 12.0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    التصنيف (Category)
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  >
                    <option value="" disabled hidden>اختر تصنيفاً</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="product-available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                  />
                  <label htmlFor="product-available" className="text-xs font-semibold text-stone-700">
                    متوفر للعملاء
                  </label>
                </div>

                {/* Options Section */}
                <div className="border-t border-stone-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-stone-700">
                      الخيارات (Options)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                    >
                      + إضافة خيار
                    </button>
                  </div>

                  {options.length === 0 && (
                    <p className="text-xs text-stone-400">لا توجد خيارات لهذا المنتج</p>
                  )}

                  <div className="space-y-4">
                    {options.map((opt) => (
                      <div key={opt.id} className="bg-stone-50 border border-stone-200 rounded-md p-3 space-y-3">
                        {/* Option Header: Title + Type + Remove */}
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              required
                              placeholder="اسم الخيار (مثال: نوع الحليب)"
                              value={opt.name}
                              onChange={(e) => handleOptionChange(opt.id, { name: e.target.value })}
                              className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOptionChange(opt.id, { type: "checkbox" })}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                  opt.type === "checkbox"
                                    ? "bg-stone-900 text-white"
                                    : "bg-white text-stone-500 border border-stone-200 hover:text-stone-900"
                                }`}
                              >
                                فردي
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOptionChange(opt.id, { type: "radio" })}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                  opt.type === "radio"
                                    ? "bg-stone-900 text-white"
                                    : "bg-white text-stone-500 border border-stone-200 hover:text-stone-900"
                                }`}
                              >
                                متعدد
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.id)}
                            className="text-stone-300 hover:text-stone-900 text-lg leading-none p-1 cursor-pointer shrink-0"
                            title="حذف الخيار"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Checkbox: Cost input */}
                        {opt.type === "checkbox" && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">التكلفة</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={opt.extraPrice ?? 0}
                              onChange={(e) => handleOptionChange(opt.id, { extraPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                              className="bg-white border border-stone-200 rounded-md px-2.5 py-1.5 text-xs text-stone-900 font-mono w-20 focus:outline-none focus:border-stone-900 transition-colors"
                            />
                          </div>
                        )}

                        {/* Radio: Required toggle + Choices */}
                        {opt.type === "radio" && (
                          <div className="space-y-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={opt.required ?? false}
                                onChange={(e) => handleOptionChange(opt.id, { required: e.target.checked })}
                                className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900 accent-stone-900"
                              />
                              <span className="text-xs text-stone-700 font-semibold">إلزامي</span>
                            </label>

                            <div className="space-y-2">
                              {(opt.choices ?? []).map((choice, idx) => (
                                <div key={choice.id} className="flex items-center gap-2">
                                  <span className="text-xs text-stone-400 w-4 text-center">{idx + 1}</span>
                                  <input
                                    type="text"
                                    required
                                    placeholder="اسم الخيار الفرعي"
                                    value={choice.name}
                                    onChange={(e) => handleChoiceChange(opt.id, choice.id, { name: e.target.value })}
                                    className="flex-1 bg-white border border-stone-200 rounded-md px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={choice.extraPrice}
                                    onChange={(e) => handleChoiceChange(opt.id, choice.id, { extraPrice: Math.max(0, parseFloat(e.target.value) || 0) })}
                                    className="w-20 bg-white border border-stone-200 rounded-md px-2 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveChoice(opt.id, choice.id)}
                                    disabled={(opt.choices?.length ?? 0) <= 2}
                                    className="text-stone-300 hover:text-stone-900 text-xs leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="حذف"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddChoice(opt.id)}
                              className="text-xs font-semibold text-stone-400 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                            >
                              + إضافة خيار فرعي
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 px-3 py-2 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {editingProduct ? "حفظ التغيرات" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
