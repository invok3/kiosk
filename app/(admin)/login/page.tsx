"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/providers/auth-provider";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/dashboard");
    }
  };


  if (loading || user) {
      return null;
    }

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-100 p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            لوحة التحكم
          </h1>
          <p className="text-sm text-stone-500">
            قم بتسجيل الدخول باستخدام البريد الالكتروني و كلمة المرور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-xs font-semibold text-stone-600 mb-1.5"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@coffeeshop.com"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 focus:bg-white transition-all placeholder:text-stone-400 text-right"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-semibold text-stone-600 mb-1.5"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 focus:bg-white transition-all placeholder:text-stone-400 text-right"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <Link 
            href="/menu" 
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← العودة لقائمة الطلبات
          </Link>
        </div>

      </div>
    </div>
  );
}