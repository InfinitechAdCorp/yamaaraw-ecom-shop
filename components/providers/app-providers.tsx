"use client";

import type React from "react";

import { ToastProvider } from "@/components/ui/toast-container";
import { CartProvider } from "@/contexts/cart-context";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  );
}
