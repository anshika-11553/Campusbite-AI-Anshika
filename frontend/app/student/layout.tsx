'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </ProtectedRoute>
  );
}
