"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartProduct } from "@/app/types/product";

interface CartContextType {
  cart: CartProduct[];
  addToCart: (item: CartProduct) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Add an item to the cart
  const addToCart = (item: CartProduct) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // Remove a specific item by its unique cart ID
  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Reset the cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total count across all product quantities
  const itemCount = cart.length;

  // Calculate total monetary value
  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        itemCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for safe consumption inside components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}