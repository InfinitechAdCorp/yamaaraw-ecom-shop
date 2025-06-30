"use client";

import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(size)}
            className={`min-w-[3rem] ${
              selectedSize === size
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "border-gray-300 hover:border-orange-300"
            }`}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
