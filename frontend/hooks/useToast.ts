'use client';

import { useToastContext } from '@/context/ToastContext';

export const useToast = () => {
  return useToastContext();
};
