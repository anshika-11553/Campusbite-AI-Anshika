'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, MenuItem } from '@/types/student';
import { useToast } from '@/hooks/useToast';
import { analytics } from '@/services/analytics';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, customization?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalAmountInINR: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const addItem = (menuItem: MenuItem, customization?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { menuItem, quantity: 1, customization }];
    });

    showToast(`${menuItem.name} added to cart!`, 'success', 'Cart Updated');
    analytics.trackAddToCart(menuItem.id, menuItem.name, menuItem.priceInINR);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.menuItem.id === itemId);
      if (target) {
        showToast(`${target.menuItem.name} removed from cart.`, 'info');
        analytics.trackRemoveFromCart(target.menuItem.id, target.menuItem.name);
      }
      return prev.filter((i) => i.menuItem.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.menuItem.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmountInINR = items.reduce((acc, item) => acc + item.menuItem.priceInINR * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmountInINR,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
