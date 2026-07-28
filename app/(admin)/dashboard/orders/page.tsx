"use client";

import { useState, useMemo, Fragment } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Order } from "@/app/types/order";
import { useOrders } from "@/app/context/providers/order-provider";
import { useSearchFilter } from "@/app/hooks/use-search-filter";
import AdminSearchBar from "@/app/ui/admin-search-bar";

const PAGE_SIZE = 10;

type TimeFilter = "all" | "today" | "week" | "month" | "year" | "custom";

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function isToday(d: Date, now: Date) {
  const s = startOfDay(now);
  const e = new Date(s);
  e.setDate(e.getDate() + 1);
  return d >= s && d < e;
}

function isThisWeek(d: Date, now: Date) {
  const s = startOfDay(now);
  s.setDate(s.getDate() - s.getDay());
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  return d >= s && d < e;
}

function isThisMonth(d: Date, now: Date) {
  const s = new Date(now.getFullYear(), now.getMonth(), 1);
  const e = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return d >= s && d < e;
}

function isThisYear(d: Date, now: Date) {
  const s = new Date(now.getFullYear(), 0, 1);
  const e = new Date(now.getFullYear() + 1, 0, 1);
  return d >= s && d < e;
}

function matchTimeFilter(order: Order, filter: TimeFilter, from?: string, to?: string, now?: Date) {
  const n = now ?? new Date();
  const d = new Date(order.date);
  switch (filter) {
    case "today": return isToday(d, n);
    case "week": return isThisWeek(d, n);
    case "month": return isThisMonth(d, n);
    case "year": return isThisYear(d, n);
    case "custom": {
      if (from) {
        const f = startOfDay(new Date(from));
        if (d < f) return false;
      }
      if (to) {
        const t = startOfDay(new Date(to));
        t.setDate(t.getDate() + 1);
        if (d >= t) return false;
      }
      return true;
    }
    default: return true;
  }
}

export default function OrdersPage() {
  const { orders } = useOrders();
  const { searchInput, setSearchInput, filterValue } = useSearchFilter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const timeFilter = (searchParams.get("time") as TimeFilter) || "all";
  const typeFilter = searchParams.get("type") || "all";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setTimeFilter = (value: TimeFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("time");
      params.delete("from");
      params.delete("to");
    } else {
      params.set("time", value);
      if (value !== "custom") {
        params.delete("from");
        params.delete("to");
      }
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setDateRange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (filterValue) {
      const term = filterValue.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          o.customerPhone.includes(term) ||
          o.id.toLowerCase().includes(term),
      );
    }

    result = result.filter((o) => matchTimeFilter(o, timeFilter, dateFrom, dateTo));

    if (typeFilter !== "all") {
      result = result.filter((o) => o.type === typeFilter);
    }

    return result;
  }, [orders, filterValue, timeFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const timeButtons: { label: string; value: TimeFilter }[] = [
    { label: "الكل", value: "all" },
    { label: "اليوم", value: "today" },
    { label: "هذا الأسبوع", value: "week" },
    { label: "هذا الشهر", value: "month" },
    { label: "هذا العام", value: "year" },
    { label: "مخصص", value: "custom" },
  ];

  const typeButtons: { label: string; value: string }[] = [
    { label: "الكل", value: "all" },
    { label: "استلام من الفرع", value: "pickup" },
    { label: "توصيل", value: "delivery" },
  ];

  return (
    <div className="h-full p-8 flex flex-col gap-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 shrink-0">
        <AdminSearchBar value={searchInput} onChange={setSearchInput} />
        <p className="text-xs text-stone-400">
          {filteredOrders.length} طلب
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-start gap-6 shrink-0">
        {/* Time Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-500">الفترة</span>
          <div className="flex items-center gap-1">
            {timeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setTimeFilter(btn.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  timeFilter === btn.value
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-500 hover:text-stone-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {timeFilter === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateRange("from", e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-md px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
              />
              <span className="text-xs text-stone-400">إلى</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateRange("to", e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-md px-2.5 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-500">النوع</span>
          <div className="flex items-center gap-1">
            {typeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => updateParam("type", btn.value === "all" ? "" : btn.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  typeFilter === btn.value
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-500 hover:text-stone-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bounded Content Slot */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 bg-white border border-stone-200 rounded-md overflow-y-auto">
          <table className="w-full text-right text-sm border-collapse">
            <thead className="sticky top-0 bg-stone-50 border-b border-stone-200 z-10">
              <tr className="text-stone-500 text-xs font-medium">
                <th className="py-3 px-6 w-8"></th>
                <th className="py-3 px-6">رقم الطلب</th>
                <th className="py-3 px-6">العميل</th>
                <th className="py-3 px-6">الهاتف</th>
                <th className="py-3 px-6">النوع</th>
                <th className="py-3 px-6">العناصر</th>
                <th className="py-3 px-6">المجموع</th>
                <th className="py-3 px-6">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedOrders.map((order) => {
                const isExpanded = expandedId === order.id;
                const d = new Date(order.date);
                const dateStr = d.toLocaleDateString("ar", { year: "numeric", month: "short", day: "numeric" });
                const timeStr = d.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });

                return (
                  <Fragment key={order.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="hover:bg-stone-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <span className={`inline-block text-stone-400 text-xs transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                          ▶
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-stone-500">{order.id}</td>
                      <td className="py-4 px-6 font-semibold text-stone-900">{order.customerName}</td>
                      <td className="py-4 px-6 text-stone-600 font-mono text-xs" dir="ltr">{order.customerPhone}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          order.type === "delivery"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-stone-100 text-stone-600"
                        }`}>
                          {order.type === "delivery" ? "توصيل" : "استلام"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-stone-600">{order.items.length}</td>
                      <td className="py-4 px-6 font-semibold text-stone-900">{order.total.toFixed(2)} ₪</td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-stone-500">{dateStr}</div>
                        <div className="text-xs text-stone-400 font-mono">{timeStr}</div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="bg-stone-50/80 px-14 py-4">
                          <div className="space-y-3">
                            {order.customerAddress && (
                              <p className="text-xs text-stone-500">
                                <span className="font-semibold text-stone-700">العنوان:</span> {order.customerAddress}
                              </p>
                            )}
                            {order.customerNotes && (
                              <p className="text-xs text-stone-500">
                                <span className="font-semibold text-stone-700">ملاحظات:</span> {order.customerNotes}
                              </p>
                            )}
                            <div className="border border-stone-200 rounded-md bg-white">
                              <table className="w-full text-right text-xs border-collapse">
                                <thead>
                                  <tr className="text-stone-400 text-xs border-b border-stone-100">
                                    <th className="py-2 px-4">المنتج</th>
                                    <th className="py-2 px-4">الكمية</th>
                                    <th className="py-2 px-4">السعر</th>
                                    <th className="py-2 px-4">المجموع</th>
                                    <th className="py-2 px-4">خيارات / ملاحظات</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                  {order.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="py-2 px-4 font-semibold text-stone-900">{item.name}</td>
                                      <td className="py-2 px-4 text-stone-600">{item.quantity}x</td>
                                      <td className="py-2 px-6 text-stone-600">{item.price.toFixed(2)} ₪</td>
                                      <td className="py-2 px-4 font-semibold text-stone-900">{item.total.toFixed(2)} ₪</td>
                                      <td className="py-2 px-4">
                                        {item.options && item.options.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-1">
                                            {item.options.map((opt, i) => (
                                              <span key={i} className="inline-flex items-center bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-xs">
                                                {opt.name}
                                                {opt.extraPrice > 0 && ` (+${opt.extraPrice.toFixed(2)} ₪)`}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                        {item.note && (
                                          <p className="text-xs text-stone-400">{item.note}</p>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 text-xs">
                    لا توجد طلبات حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => setPage(safePage - 1)}
            disabled={safePage <= 1}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            السابق
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`w-8 h-8 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                page === safePage
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-500 hover:text-stone-900"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
