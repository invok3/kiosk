"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Order } from "@/app/types/order";
import { useAuth } from "@/app/context/providers/auth-provider";

interface OrderContextType {
  orders: Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export default function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const result: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(result);
    });

    return () => unsubscribe();
  }, [user]);

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
