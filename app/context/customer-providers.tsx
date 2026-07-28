"use client";

import { Composer } from "@/app/context/composer";
import { CartProvider } from "@/app/context/providers/cart-context";
import MenuProvider from "@/app/context/providers/menu-provider";

const providers = [
  MenuProvider,
  CartProvider,
];

export function CustomerProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}
