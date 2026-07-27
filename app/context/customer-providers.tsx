"use client";

import { Composer } from "@/app/context/composer";
import { CartProvider } from "@/app/context/providers/cart-context";
import DataProvider from "@/app/context/providers/data-provider";

const providers = [
  CartProvider,
  DataProvider,
];

export function CustomerProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}
