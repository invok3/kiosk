"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ORDERS } from "@/app/data/orders";
import { Order } from "@/app/types/order";

interface OrderContextType {
  orders: Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export default function OrderProvider({ children }: { children: ReactNode }) {
  const [orders] = useState<Order[]>(ORDERS);

  return (
    <OrderContext.Provider value={{ orders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
