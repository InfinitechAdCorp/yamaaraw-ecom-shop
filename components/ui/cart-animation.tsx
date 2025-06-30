"use client";

import { useEffect, useState } from "react";

interface CartAnimationProps {
  isVisible: boolean;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function CartAnimation({
  isVisible,
  startPosition,
  onComplete,
}: CartAnimationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* E-trike SVG Animation */}
      <div
        className="absolute transition-all duration-1000 ease-out"
        style={{
          left: `${startPosition.x}px`,
          top: `${startPosition.y}px`,
          transform: isVisible
            ? "translate(calc(100vw - 120px), -50px) scale(0.5)"
            : "translate(0, 0) scale(1)",
        }}
      >
        <div className="relative">
          {/* E-trike SVG */}
          <svg
            width="60"
            height="40"
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-bounce"
          >
            {/* Trike Body */}
            <rect x="30" y="20" width="40" height="15" rx="3" fill="#F97316" />

            {/* Front Wheel */}
            <circle
              cx="20"
              cy="45"
              r="8"
              stroke="#F97316"
              strokeWidth="2"
              fill="white"
              className="animate-spin"
            />

            {/* Rear Wheels */}
            <circle
              cx="75"
              cy="45"
              r="8"
              stroke="#F97316"
              strokeWidth="2"
              fill="white"
              className="animate-spin"
            />
            <circle
              cx="85"
              cy="45"
              r="8"
              stroke="#F97316"
              strokeWidth="2"
              fill="white"
              className="animate-spin"
            />

            {/* Handlebars */}
            <path
              d="M25 25 L30 20 L35 25"
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
            />

            {/* Seat */}
            <rect x="45" y="15" width="12" height="4" rx="2" fill="#F97316" />

            {/* Connection lines */}
            <path d="M30 27 L20 37" stroke="#F97316" strokeWidth="2" />
            <path d="M70 35 L75 37 L85 37" stroke="#F97316" strokeWidth="2" />
          </svg>

          {/* Trail effect */}
          <div className="absolute top-1/2 left-0 w-8 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full opacity-60 animate-pulse"></div>
        </div>
      </div>

      {/* Success message */}
      <div
        className="absolute top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        Added to cart! 🛒
      </div>
    </div>
  );
}
