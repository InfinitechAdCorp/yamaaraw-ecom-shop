"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface FlyingETrikeProps {
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

export const FlyingETrike = ({
  startPosition,
  endPosition,
  onComplete,
}: FlyingETrikeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;

  return (
    <div
      className="fixed pointer-events-none z-[10000]"
      style={{
        left: startPosition.x,
        top: startPosition.y,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div
        className="relative transition-all duration-1000 ease-out"
        style={{
          transform: `translate(${deltaX}px, ${deltaY}px) scale(0.5) rotate(360deg)`,
        }}
      >
        {/* E-Trike Animation */}
        <div className="relative w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Zap className="w-6 h-6 text-white animate-pulse" />

          {/* Trail Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-ping opacity-75"></div>

          {/* Spark Effects */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-150"></div>
          <div className="absolute top-1 -left-2 w-2 h-2 bg-red-300 rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Speed Lines */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8">
          <div className="flex space-x-1">
            <div className="w-4 h-0.5 bg-orange-400 opacity-60 animate-pulse"></div>
            <div className="w-3 h-0.5 bg-orange-300 opacity-40 animate-pulse delay-75"></div>
            <div className="w-2 h-0.5 bg-orange-200 opacity-20 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing flying animations
export const useFlyingETrike = () => {
  const [animations, setAnimations] = useState<
    Array<{
      id: string;
      startPos: { x: number; y: number };
      endPos: { x: number; y: number };
    }>
  >([]);

  const triggerAnimation = (
    startElement: HTMLElement,
    endElement: HTMLElement
  ) => {
    const startRect = startElement.getBoundingClientRect();
    const endRect = endElement.getBoundingClientRect();

    const startPos = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };

    const endPos = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    const id = Math.random().toString(36).substr(2, 9);
    setAnimations((prev) => [...prev, { id, startPos, endPos }]);
  };

  const removeAnimation = (id: string) => {
    setAnimations((prev) => prev.filter((anim) => anim.id !== id));
  };

  const AnimationContainer = () => (
    <>
      {animations.map(({ id, startPos, endPos }) => (
        <FlyingETrike
          key={id}
          startPosition={startPos}
          endPosition={endPos}
          onComplete={() => removeAnimation(id)}
        />
      ))}
    </>
  );

  return { triggerAnimation, AnimationContainer };
};
