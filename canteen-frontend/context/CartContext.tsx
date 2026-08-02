"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/lib/api";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItemsCount: number;
  totalCalories: number;
  totalProtein: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isValidUUID = (id: string) =>
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("campusbite_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (ci: any) =>
              ci &&
              ci.item &&
              typeof ci.item === "object" &&
              isValidUUID(ci.item.id) &&
              typeof ci.item.price === "number"
          );
          setCart(valid);
          // Overwrite localStorage if stale non-UUID items were purged
          if (valid.length !== parsed.length) {
            localStorage.setItem("campusbite_cart", JSON.stringify(valid));
          }
        } else {
          localStorage.removeItem("campusbite_cart");
        }
      }
    } catch (e) {
      localStorage.removeItem("campusbite_cart");
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    const validCart = (newCart || []).filter(
      (ci) =>
        ci &&
        ci.item &&
        typeof ci.item === "object" &&
        isValidUUID(ci.item.id) &&
        typeof ci.item.price === "number"
    );
    setCart(validCart);
    try {
      localStorage.setItem("campusbite_cart", JSON.stringify(validCart));
    } catch (e) { }
  };

  const addToCart = (item: MenuItem) => {
    console.log("ADDING ID:", item.id);

    if (!item || !item.id || typeof item.price !== "number") return;
    const existingIndex = cart.findIndex((ci) => ci?.item?.id === item.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + 1;
      saveCart(newCart);
    } else {
      saveCart([...cart, { item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    if (!itemId) return;
    saveCart(cart.filter((ci) => ci?.item?.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    if (!itemId) return;
    const newCart = cart
      .map((ci) => {
        if (ci?.item?.id === itemId) {
          const newQty = (ci.quantity || 1) + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      })
      .filter(Boolean) as CartItem[];

    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    try {
      localStorage.removeItem("campusbite_cart");
    } catch (e) { }
  };

  const totalAmount = (cart || []).reduce((acc, ci) => {
    const price = ci && ci.item && typeof ci.item.price === "number" ? ci.item.price : 0;
    const qty = ci && typeof ci.quantity === "number" ? ci.quantity : 0;
    return acc + price * qty;
  }, 0);

  const totalItemsCount = (cart || []).reduce((acc, ci) => {
    return acc + (ci && typeof ci.quantity === "number" ? ci.quantity : 0);
  }, 0);

  const totalCalories = (cart || []).reduce((acc, ci) => {
    if (!ci || !ci.item) return acc;
    const baseCal = ci.item.category === "Main Course" ? 450 : ci.item.category === "Snacks" ? 280 : 180;
    return acc + baseCal * (ci.quantity || 1);
  }, 0);

  const totalProtein = (cart || []).reduce((acc, ci) => {
    if (!ci || !ci.item) return acc;
    const baseProt = ci.item.name?.toLowerCase().includes("paneer") ? 18 : ci.item.category === "Main Course" ? 14 : 6;
    return acc + baseProt * (ci.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItemsCount,
        totalCalories,
        totalProtein,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
