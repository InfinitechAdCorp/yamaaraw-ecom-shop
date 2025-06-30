"use client";

interface ColorSelectorProps {
  colors: Array<{ name: string; value: string }>;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ColorSelector({
  colors,
  selectedIndex,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Color</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`flex items-center space-x-2 p-2 rounded-lg border-2 transition-all hover:shadow-md ${
              selectedIndex === index
                ? "border-orange-500 bg-orange-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-sm font-medium text-gray-900">
              {color.name}
            </span>
          </button>
        ))}
      </div>
      {selectedIndex !== null && colors[selectedIndex] && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <span className="font-medium">Selected Color:</span>{" "}
          {colors[selectedIndex].name}
        </div>
      )}
    </div>
  );
}
