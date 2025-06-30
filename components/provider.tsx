"use client";

import { type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast-container";
import { CartProvider } from "@/contexts/cart-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
