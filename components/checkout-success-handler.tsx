"use client";

import { useEffect } from "react";
import { clearCartAfterCheckout } from "@/lib/cart";

// Component to handle cart clearing after successful checkout
export default function CheckoutSuccessHandler() {
  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      try {
        console.log("Checkout success event received, clearing cart...");
        await clearCartAfterCheckout();

        // Force a page refresh for the cart page specifically
        if (window.location.pathname === "/cart") {
          window.location.reload();
        }

        console.log("Cart cleared after successful checkout");
      } catch (error) {
        console.error("Error clearing cart after checkout:", error);
      }
    };

    const handleCartCleared = () => {
      console.log("Cart cleared event received");
      // Force refresh cart data
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    };

    // Listen for checkout success event
    window.addEventListener("checkoutSuccess", handleCheckoutSuccess);
    window.addEventListener("cartCleared", handleCartCleared);

    return () => {
      window.removeEventListener("checkoutSuccess", handleCheckoutSuccess);
      window.removeEventListener("cartCleared", handleCartCleared);
    };
  }, []);

  return null; // This component doesn't render anything
}
