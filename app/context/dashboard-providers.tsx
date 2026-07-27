"use client";

import { Composer } from "@/app/context/composer";
import AuthProvider from "@/app/context/providers/auth-provider";


const providers = [
  AuthProvider,
  //DataProvider,
];

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <Composer providers={providers}>{children}</Composer>;
}