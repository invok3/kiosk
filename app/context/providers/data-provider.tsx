"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { MENU } from "@/app/data/menu";
import { Category } from "@/app/types/category";

interface DataContextType {
  categories: Category[];
  addCategory(cat: Category): void;
  updateCategory(id: string, updates: Partial<Category>): void;
  deleteCategory(id: string): void;
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

  const save = useCallback(() => {
    // Firebase push logic will hook in here later
    console.log("Saving menu to Firebase...", { categories });
    setEdited(false);
  }, [categories]);

  const value = useMemo(
    () => ({ categories, addCategory, updateCategory, deleteCategory, edited, save }),
    [categories, addCategory, updateCategory, deleteCategory, edited, save]
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
