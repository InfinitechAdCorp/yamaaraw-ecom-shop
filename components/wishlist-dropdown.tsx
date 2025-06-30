"use client"

import { useState } from "react"
import { Heart, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface WishlistItem {
  id: string
  productId: number
  name: string
  price: number
  image: string
  inStock: boolean
}

export default function WishlistDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: "1",
      productId: 1,
      name: "Electric Scooter Pro",
      price: 25000,
      image: "/placeholder.svg?height=60&width=60",
      inStock: true,
    },
    {
      id: "2",
      productId: 2,
      name: "E-Bike Mountain",
      price: 45000,
      image: "/placeholder.svg?height=60&width=60",
      inStock: false,
    },
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addToCart = (item: WishlistItem) => {
    // Add to cart logic here
    console.log("Adding to cart:", item)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2 rounded-full hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Heart className="w-5 h-5 text-gray-600" />
        {wishlistItems.length > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-pink-500 text-white text-xs">
            {wishlistItems.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Wishlist ({wishlistItems.length})</h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {wishlistItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Your wishlist is empty</p>
                <p className="text-xs mt-1">Save items you love for later</p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div key={item.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-orange-600 font-semibold">{formatPrice(item.price)}</p>
                      <p className={`text-xs ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                        disabled={!item.inStock}
                        className="text-xs px-2 py-1"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {wishlistItems.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
                View All Wishlist
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
