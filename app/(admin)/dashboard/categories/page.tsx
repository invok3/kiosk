"use client";

import { Suspense, useState, useMemo } from "react";
import { Category } from "@/app/types/category";
import { useData } from "@/app/context/providers/menu-provider";
import { useSearchFilter } from "@/app/hooks/use-search-filter";
import AdminSearchBar from "@/app/ui/admin-search-bar";

function CategoriesContent() {
  const { categories, addCategory, updateCategory, deleteCategory, productsByCategory } = useData();
  const { searchInput, setSearchInput, filterValue } = useSearchFilter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", label: "", available: true });

  const filteredCategories = useMemo(() => {
    if (!filterValue) return categories;
    const term = filterValue.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.label.toLowerCase().includes(term) ||
        cat.name.toLowerCase().includes(term),
    );
  }, [categories, filterValue]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", label: "", available: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, label: cat.label, available: cat.available });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.label.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.trim(),
        label: formData.label.trim(),
        available: formData.available,
      });
    } else {
      const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 0;
      const newCat: Category = {
        id: nextId,
        name: formData.name.trim(),
        label: formData.label.trim(),
        available: true,
      };
      addCategory(newCat);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-8 flex flex-col gap-6">
      {/* 1. Action Bar (Header) - Fixed height */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
        <AdminSearchBar value={searchInput} onChange={setSearchInput} />

        <button
          onClick={handleOpenAdd}
          className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
        >
          إضافة صنف جديد
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
                <th className="py-3 px-6 text-center">المنتجات</th>
                <th className="py-3 px-6 text-center">متوفر</th>
                <th className="py-3 px-6 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCategories.map((cat) => {
                const count = productsByCategory(cat.id).length;
                return (
                <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-stone-900">{cat.label}</td>
                  <td className="py-4 px-6 text-stone-500 font-mono text-xs">{cat.name}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold ${
                      count > 0
                        ? "bg-stone-100 text-stone-700"
                        : "bg-stone-50 text-stone-400"
                    }`}>
                      {count}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      checked={cat.available}
                      onChange={() => updateCategory(cat.id, { available: !cat.available })}
                      className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer accent-stone-700"
                    />
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-4 text-xs font-semibold">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="text-stone-700 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-stone-400 hover:text-stone-900 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400 text-xs">
                    لا توجد أصناف حالياً
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
          <div className="bg-white border border-stone-200 rounded-md max-w-sm w-full p-6 space-y-6 shadow-xl">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {editingCategory ? "تعديل صنف" : "إضافة صنف جديد"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  المسمى (Label)
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مشروبات باردة"
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
                  placeholder="مثال: cold-drinks"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                />
                <label htmlFor="available" className="text-xs font-semibold text-stone-700">
                  متوفر للعملاء
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
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
                  {editingCategory ? "حفظ التغيرات" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesContent />
    </Suspense>
  );
}
