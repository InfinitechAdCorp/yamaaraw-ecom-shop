"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem as CartItemType } from "@/lib/types";
import { updateCartQuantity, removeFromCart } from "@/lib/cart";

interface CartItemProps {
  item: CartItemType;
  onUpdate: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateCartQuantity(item.id, newQuantity);
    onUpdate();
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    onUpdate();
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.images[0] || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600">{item.product.model}</p>
        <p className="text-lg font-bold text-gray-900">
          ₱{item.product.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-bold text-lg">
          ₱{(item.product.price * quantity).toLocaleString()}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
