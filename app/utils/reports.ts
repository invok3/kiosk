import { Order } from "@/app/types/order";
import {
  getTotalOrders,
  getTotalSales,
  getAverageOrderValue,
  getUniqueCustomerCount,
  getTopSellingProduct,
  getOrdersByType,
  getMonthlyRevenue,
  getTopCustomers,
  getGrowthRate,
  getOrdersInMonth,
  type ProductStat,
  type CustomerStat,
  type MonthlyRevenue,
} from "./statistics";

export interface DashboardSummary {
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  ordersGrowth: number;
  salesGrowth: number;
  avgOrderGrowth: number;
  customerGrowth: number;
  topProduct: ProductStat | null;
  ordersByType: { pickup: number; delivery: number };
  monthlyRevenue: MonthlyRevenue[];
  topCustomers: CustomerStat[];
}

export function getDashboardSummary(orders: Order[]): DashboardSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentOrders = getOrdersInMonth(orders, currentYear, currentMonth);
  const prevOrders = getOrdersInMonth(orders, prevYear, prevMonth);

  return {
    totalOrders: getTotalOrders(orders),
    totalSales: getTotalSales(orders),
    averageOrderValue: getAverageOrderValue(orders),
    uniqueCustomers: getUniqueCustomerCount(orders),
    ordersGrowth: getGrowthRate(getTotalOrders(currentOrders), getTotalOrders(prevOrders)),
    salesGrowth: getGrowthRate(getTotalSales(currentOrders), getTotalSales(prevOrders)),
    avgOrderGrowth: getGrowthRate(getAverageOrderValue(currentOrders), getAverageOrderValue(prevOrders)),
    customerGrowth: getGrowthRate(getUniqueCustomerCount(currentOrders), getUniqueCustomerCount(prevOrders)),
    topProduct: getTopSellingProduct(orders),
    ordersByType: getOrdersByType(orders),
    monthlyRevenue: getMonthlyRevenue(orders),
    topCustomers: getTopCustomers(orders),
  };
}
