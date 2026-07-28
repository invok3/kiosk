"use client";

import { Composer } from "@/app/context/composer";
import AuthProvider from "@/app/context/providers/auth-provider";
import MenuProvider from "@/app/context/providers/menu-provider";
import OrderProvider from "@/app/context/providers/order-provider";


const providers = [
  AuthProvider,
  MenuProvider,
  OrderProvider,
];

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}