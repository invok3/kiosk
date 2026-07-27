import { Order } from "@/app/types/order";

export function getTotalOrders(orders: Order[]): number {
  return orders.length;
}

export function getTotalSales(orders: Order[]): number {
  return orders.reduce((sum, o) => sum + o.total, 0);
}

export function getAverageOrderValue(orders: Order[]): number {
  if (orders.length === 0) return 0;
  return getTotalSales(orders) / orders.length;
}

export function getUniqueCustomerCount(orders: Order[]): number {
  return new Set(orders.map((o) => o.customerPhone)).size;
}

export interface ProductStat {
  name: string;
  quantity: number;
  revenue: number;
}

export function getProductSales(orders: Order[]): ProductStat[] {
  const map = new Map<string, ProductStat>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.name);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.total;
      } else {
        map.set(item.name, { name: item.name, quantity: item.quantity, revenue: item.total });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

export function getTopSellingProduct(orders: Order[]): ProductStat | null {
  const products = getProductSales(orders);
  return products[0] ?? null;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export function getMonthlyRevenue(orders: Order[]): MonthlyRevenue[] {
  const map = new Map<string, number>();
  for (const order of orders) {
    const d = new Date(order.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + order.total);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, revenue]) => ({ month, revenue }));
}

export function getOrdersByType(orders: Order[]): { pickup: number; delivery: number } {
  let pickup = 0;
  let delivery = 0;
  for (const order of orders) {
    if (order.type === "pickup") pickup++;
    else delivery++;
  }
  return { pickup, delivery };
}

export function getGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export interface CustomerStat {
  name: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
}

export function getTopCustomers(orders: Order[], limit = 5): CustomerStat[] {
  const map = new Map<string, CustomerStat>();
  for (const order of orders) {
    const key = order.customerPhone;
    const existing = map.get(key);
    if (existing) {
      existing.totalSpent += order.total;
      existing.orderCount++;
    } else {
      map.set(key, {
        name: order.customerName,
        phone: order.customerPhone,
        totalSpent: order.total,
        orderCount: 1,
      });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

export function getOrdersInMonth(orders: Order[], year: number, month: number): Order[] {
  return orders.filter((o) => {
    const d = new Date(o.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
