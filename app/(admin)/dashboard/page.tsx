"use client";

import { useMemo } from "react";
import { useOrders } from "@/app/context/providers/order-provider";
import { getDashboardSummary } from "@/app/utils/reports";

function GrowthIndicator({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs text-stone-400">—</span>;
  }
  const isPositive = value > 0;
  return (
    <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
      {isPositive ? "↑" : "↓"} %{Math.abs(value).toFixed(1)}
    </span>
  );
}

const MONTH_NAMES: Record<string, string> = {
  "01": "يناير",
  "02": "فبراير",
  "03": "مارس",
  "04": "أبريل",
  "05": "مايو",
  "06": "يونيو",
  "07": "يوليو",
  "08": "أغسطس",
  "09": "سبتمبر",
  "10": "أكتوبر",
  "11": "نوفمبر",
  "12": "ديسمبر",
};

function formatMonth(key: string): string {
  const [year, month] = key.split("-");
  return `${MONTH_NAMES[month] ?? month} ${year}`;
}

export default function DashboardPage() {
  const { orders } = useOrders();
  const summary = useMemo(() => getDashboardSummary(orders), [orders]);

  const statCards = [
    { label: "الطلبات", value: summary.totalOrders, growth: summary.ordersGrowth },
    { label: "المبيعات", value: `${summary.totalSales.toFixed(2)} ₪`, growth: summary.salesGrowth },
    { label: "متوسط الطلب", value: `${summary.averageOrderValue.toFixed(2)} ₪`, growth: summary.avgOrderGrowth },
    { label: "العملاء", value: summary.uniqueCustomers, growth: summary.customerGrowth },
  ];

  const totalType = summary.ordersByType.pickup + summary.ordersByType.delivery;

  return (
    <div className="h-full p-8 flex flex-col gap-6 overflow-y-auto">
      {/* Stat Cards */}
      <div>
        <h2 className="text-xs font-semibold text-stone-500 mb-3">إحصائيات عامة</h2>
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white border border-stone-200 rounded-md p-5 flex flex-col gap-1">
              <span className="text-xs text-stone-500">{card.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-stone-900">{card.value}</span>
                <GrowthIndicator value={card.growth} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Top Product + Order Type */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top Selling Product */}
        <div className="bg-white border border-stone-200 rounded-md p-5">
          <h3 className="text-xs font-semibold text-stone-500 mb-3">الأكثر مبيعاً</h3>
          {summary.topProduct ? (
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-stone-900">{summary.topProduct.label}</span>
                <span className="text-xs text-stone-400 mr-2">({summary.topProduct.quantity} مبيعة)</span>
              </div>
              <span className="text-sm font-semibold text-stone-700">{summary.topProduct.revenue.toFixed(2)} ₪</span>
            </div>
          ) : (
            <p className="text-xs text-stone-400">لا توجد بيانات</p>
          )}
          <div className="border-t border-stone-100 pt-3">
            <p className="text-xs text-stone-400 mb-2">إجمالي المبيعات حسب المنتج</p>
            <div className="space-y-1.5">
              {summary.monthlyRevenue.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">إجمالي المنتجات المباعة</span>
                  <span className="font-semibold text-stone-900">{summary.totalOrders} طلب</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Type Breakdown */}
        <div className="bg-white border border-stone-200 rounded-md p-5">
          <h3 className="text-xs font-semibold text-stone-500 mb-3">نوع الطلبات</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-stone-700">استلام من الفرع</span>
                <span className="text-sm font-semibold text-stone-900">{summary.ordersByType.pickup}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div
                  className="bg-stone-900 h-2 rounded-full transition-all"
                  style={{ width: totalType > 0 ? `${(summary.ordersByType.pickup / totalType) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-stone-700">توصيل</span>
                <span className="text-sm font-semibold text-stone-900">{summary.ordersByType.delivery}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: totalType > 0 ? `${(summary.ordersByType.delivery / totalType) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Monthly Revenue + Top Customers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white border border-stone-200 rounded-md p-5">
          <h3 className="text-xs font-semibold text-stone-500 mb-3">المبيعات الشهرية</h3>
          <div className="space-y-2.5">
            {summary.monthlyRevenue.map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm text-stone-600">{formatMonth(item.month)}</span>
                <span className="text-sm font-semibold text-stone-900">{item.revenue.toFixed(2)} ₪</span>
              </div>
            ))}
            {summary.monthlyRevenue.length === 0 && (
              <p className="text-xs text-stone-400">لا توجد بيانات</p>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white border border-stone-200 rounded-md p-5">
          <h3 className="text-xs font-semibold text-stone-500 mb-3">أفضل العملاء</h3>
          <div className="space-y-2.5">
            {summary.topCustomers.map((customer, i) => (
              <div key={customer.phone} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 w-4 text-center">{i + 1}</span>
                  <span className="text-sm font-semibold text-stone-900">{customer.name}</span>
                  <span className="text-xs text-stone-400">({customer.orderCount} طلبات)</span>
                </div>
                <span className="text-sm font-semibold text-stone-900">{customer.totalSpent.toFixed(2)} ₪</span>
              </div>
            ))}
            {summary.topCustomers.length === 0 && (
              <p className="text-xs text-stone-400">لا توجد بيانات</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
