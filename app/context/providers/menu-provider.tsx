"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/app/data/menu";
import { Category } from "@/app/types/category";
import { Product } from "@/app/types/product";

export interface ProductWithCategory extends Product {
  categoryLabel: string;
}

interface DataContextType {
  categories: Category[];
  addCategory(cat: Category): void;
  updateCategory(id: number, updates: Partial<Category>): void;
  deleteCategory(id: number): void;
  products: ProductWithCategory[];
  addProduct(product: Product): void;
  updateProduct(productId: number, updates: Partial<Product>): void;
  deleteProduct(productId: number): void;
  productsByCategory(categoryId: number): Product[];
  edited: boolean;
  save(): void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export default function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [edited, setEdited] = useState(false);

  const addCategory = useCallback((cat: Category) => {
    setCategories((prev) => [...prev, cat]);
    setEdited(true);
  }, []);

  const updateCategory = useCallback((id: number, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    setEdited(true);
  }, []);

  const deleteCategory = useCallback((id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setEdited(true);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
    setEdited(true);
  }, []);

  const updateProduct = useCallback((productId: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    setEdited(true);
  }, []);

  const deleteProduct = useCallback((productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setEdited(true);
  }, []);

  const productsByCategory = useCallback((categoryId: number) => {
    return products.filter((p) => p.category_id === categoryId);
  }, [products]);

  const save = useCallback(() => {
    // Firebase push logic will hook in here later
    console.log("Saving menu to Firebase...", { categories, products });
    setEdited(false);
  }, [categories, products]);

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      products: products.map((p) => {
        const cat = categories.find((c) => c.id === p.category_id);
        return { ...p, categoryLabel: cat?.label ?? "" };
      }),
      addProduct,
      updateProduct,
      deleteProduct,
      productsByCategory,
      edited,
      save,
    }),
    [categories, products, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct, productsByCategory, edited, save]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a MenuProvider");
  }
  return context;
}
