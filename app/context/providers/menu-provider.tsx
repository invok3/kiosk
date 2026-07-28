"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [edited, setEdited] = useState(false);

  const categoriesRef = useRef(doc(db, "menu", "categories"));
  const productsRef = useRef(doc(db, "menu", "products"));

  useEffect(() => {
    const unsubCategories = onSnapshot(categoriesRef.current, (snap) => {
      const data = snap.data();
      if (data?.list) setCategories(data.list as Category[]);
    });

    const unsubProducts = onSnapshot(productsRef.current, (snap) => {
      const data = snap.data();
      if (data?.list) setProducts(data.list as Product[]);
    });

    return () => {
      unsubCategories();
      unsubProducts();
    };
  }, []);

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

  const save = useCallback(async () => {
    await Promise.all([
      setDoc(categoriesRef.current, { list: categories }),
      setDoc(productsRef.current, { list: products }),
    ]);
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
