"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/providers/auth-provider";
import { useData } from "@/app/context/providers/data-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const { save, edited } = useData();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if user is unauthenticated
  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/login");
  //   }
  // }, [user, router]);

  // if (!user) {
  //   return null;
  // }

  const navItems = [
    { label: "الرئيسية", href: "/dashboard" },
    { label: "الأصناف", href: "/dashboard/categories" },
    { label: "المنتجات", href: "/dashboard/products" },
    { label: "الطلبات", href: "/dashboard/orders" },
  ];

  const currentNav = navItems.find((n) =>
    n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href)
  );

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Nav Title */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-stone-900">
                {currentNav?.label ?? "لوحة التحكم"}
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={save}
              className={`text-xs font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer ${
                edited
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-stone-100 text-stone-400"
              }`}
            >
              حفظ
            </button>
            <button
              onClick={() => {
                // Firebase signOut logic will hook in here later
                console.log("Signing out...");
              }}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>

        </div>
      </header>

      {/* Main Container - Split into Sidebar + Content */}
      <div className="flex-1 w-full mx-auto flex">
        
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white p-2">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}