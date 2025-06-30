"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { addToCart } from "@/lib/cart"
import { useClientToast } from "@/hooks/use-client-toast"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    original_price?: number
    description: string
    images: string[]
    category: string
    in_stock: boolean
    featured?: boolean
    model?: string
  }
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const toast = useClientToast()
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = async (event: React.MouseEvent) => {
    // Prevent card click when clicking add to cart button
    event.stopPropagation()

    if (!product.id) {
      console.error("Product ID is missing")
      return
    }

    try {
      setIsAdding(true)

      // Create animation element
      const button = event.currentTarget as HTMLElement
      const rect = button.getBoundingClientRect()
      const cartIcon = document.querySelector("[data-cart-icon]")
      const cartRect = cartIcon?.getBoundingClientRect()

      if (cartRect) {
        const animationEl = document.createElement("div")
        animationEl.className = "fixed w-8 h-8 bg-orange-500 rounded-full z-50 pointer-events-none"
        animationEl.style.left = `${rect.left + rect.width / 2 - 16}px`
        animationEl.style.top = `${rect.top + rect.height / 2 - 16}px`
        animationEl.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"

        document.body.appendChild(animationEl)

        // Trigger animation
        setTimeout(() => {
          animationEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`
          animationEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`
          animationEl.style.transform = "scale(0.5)"
          animationEl.style.opacity = "0"
        }, 100)

        // Clean up
        setTimeout(() => {
          document.body.removeChild(animationEl)
        }, 900)
      }

      // Convert string ID to number if needed
      const productId = typeof product.id === "string" ? Number.parseInt(product.id) : product.id
      await addToCart(productId, 1)
      
      // Show success toast
      toast.cartAdded(product.name)
      
      console.log("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to Add", "Could not add item to cart. Please try again.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/products/${product.id}`)
  }

  const handleWishlistClick = (event: React.MouseEvent) => {
    // Prevent card click when clicking wishlist button
    event.stopPropagation()
    // Add wishlist functionality here
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100 hover:border-orange-300 cursor-pointer"
    >
      {/* Image Container - Fixed aspect ratio with better image handling */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
        <Image
          src={product.images?.[0] || "/placeholder.svg?height=256&width=320"}
          alt={product.name}
          fill
          className={`object-contain p-4 group-hover:scale-110 transition-transform duration-700 ${
            imageError ? "object-cover" : ""
          }`}
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-row gap-2">
          {product.original_price && discountPercentage > 0 && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
              -{discountPercentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Stock Status Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <Badge variant="destructive" className="text-white font-bold px-4 py-2 text-base shadow-lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Category Badge */}
        <Badge
          variant="outline"
          className="mb-3 text-xs font-semibold bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors"
        >
          {product.category}
        </Badge>

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
          {product.name}
        </h3>

        {/* Model */}
        {product.model && (
          <p className="text-sm text-gray-500 mb-2 font-medium">
            Model: <span className="text-gray-700">{product.model}</span>
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-orange-400 fill-current drop-shadow-sm" />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">(5.0)</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">₱{product.price.toLocaleString()}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through font-medium">
                ₱{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <div className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Save ₱{(product.original_price! - product.price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Enhanced Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock || isAdding}
          className={`w-full h-12 font-bold text-base shadow-lg transition-all duration-300 ${
            product.in_stock
              ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg font-semibold hover:shadow-xl"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isAdding ? (
            <span className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding...
            </span>
          ) : product.in_stock ? (
            "Add to Cart"
          ) : (
            "Out of Stock"
          )}
        </Button>
      </div>
    </div>
  )
}

export default ProductCard
