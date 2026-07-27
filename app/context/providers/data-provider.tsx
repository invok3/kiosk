"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { MENU } from "@/app/data/menu";
import { Category } from "@/app/types/category";
import { Product } from "@/app/types/product";

export interface ProductWithCategory extends Product {
  categoryId: string;
  categoryTitle: string;
}

interface DataContextType {
  categories: Category[];
  addCategory(cat: Category): void;
  updateCategory(id: string, updates: Partial<Category>): void;
  deleteCategory(id: string): void;
  products: ProductWithCategory[];
  addProduct(product: Omit<Product, "id"> & { id?: string }, categoryId: string): void;
  updateProduct(productId: string, updates: Partial<Product>, categoryId: string): void;
  deleteProduct(productId: string, categoryId: string): void;
  edited: boolean;
  save(): void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export default function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(MENU.categories);
  const [edited, setEdited] = useState(false);

  const addCategory = useCallback((cat: Category) => {
    setCategories((prev) => [...prev, cat]);
    setEdited(true);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    setEdited(true);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setEdited(true);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id"> & { id?: string }, categoryId: string) => {
    const id = product.id ?? Math.random().toString(36).slice(2, 10);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, products: [...c.products, { ...product, id }] }
          : c
      )
    );
    setEdited(true);
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>, categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              products: c.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
            }
          : c
      )
    );
    setEdited(true);
  }, []);

  const deleteProduct = useCallback((productId: string, categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, products: c.products.filter((p) => p.id !== productId) } : c
      )
    );
    setEdited(true);
  }, []);

  const save = useCallback(() => {
    // Firebase push logic will hook in here later
    console.log("Saving menu to Firebase...", { categories });
    setEdited(false);
  }, [categories]);

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      products: categories.flatMap((c) =>
        c.products.map((p) => ({ ...p, categoryId: c.id, categoryTitle: c.title }))
      ),
      addProduct,
      updateProduct,
      deleteProduct,
      edited,
      save,
    }),
    [categories, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct, edited, save]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
