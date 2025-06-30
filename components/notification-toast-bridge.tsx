"use client";

import { useEffect } from "react";

// This component will be rendered inside pages that need toast integration
export default function NotificationToastBridge() {
  useEffect(() => {
    // Set up a simple global toast function that logs to console
    // This prevents the notification context from breaking
    if (typeof window !== "undefined") {
      (window as any).showToast = ({
        type,
        title,
        message,
      }: {
        type: string;
        title: string;
        message?: string;
      }) => {
        console.log(
          `🔔 ${type.toUpperCase()}: ${title}${message ? ` - ${message}` : ""}`
        );

        // Try to show browser notification if available
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, {
            body: message,
            icon: "/favicon.ico",
          });
        }
      };
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).showToast;
      }
    };
  }, []);

  return null;
}
