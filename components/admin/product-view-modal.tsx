"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Star, Shield, Truck, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProductData } from "@/lib/api"

interface ProductViewModalProps {
  product: ProductData
  onClose: () => void
}

export default function ProductViewModal({ product, onClose }: ProductViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price)
  }

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
          {/* Left Side - Images */}
          <div className="lg:w-1/2 p-6 bg-gray-50">
            <div className="sticky top-0">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
                <Image
                  src={product.images?.[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {/* Discount Badge - Fixed positioning and z-index */}
                {discount > 0 && (
                  <div
                    className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white"
                    style={{ zIndex: 30 }}
                  >
                    -{discount}%
                  </div>
                )}
                {/* Featured Badge */}
                {product.featured && (
                  <div
                    className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg border-2 border-white"
                    style={{ zIndex: 30 }}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-orange-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="lg:w-1/2 p-6 space-y-6">
            {/* Product Title & Category */}
            <div>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-3">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.model}</p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-orange-600">{formatPrice(product.price)}</div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-xl text-gray-500 line-through">{formatPrice(product.original_price)}</div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4 mb-6">
                <Badge
                  className={
                    product.in_stock
                      ? "bg-green-100 text-green-600 border-green-200"
                      : "bg-red-100 text-red-600 border-red-200"
                  }
                >
                  {product.in_stock ? "✓ In Stock" : "✗ Out of Stock"}
                </Badge>
                {product.featured && (
                  <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">⭐ Featured Product</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Available Colors */}
            {product.colors && product.colors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm text-gray-700">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ideal For */}
            {product.ideal_for && product.ideal_for.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ideal For</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.ideal_for.map((use, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-600">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.dimensions && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.dimensions}</dd>
                      </div>
                    )}
                    {product.specifications.battery_type && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Battery Type</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.battery_type}</dd>
                      </div>
                    )}
                    {product.specifications.motor_power && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Motor Power</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.motor_power}</dd>
                      </div>
                    )}
                    {product.specifications.main_features && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Main Features</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.main_features}</dd>
                      </div>
                    )}
                    {product.specifications.front_rear_suspension && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Suspension</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.front_rear_suspension}</dd>
                      </div>
                    )}
                    {product.specifications.front_tires && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Front Tires</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.front_tires}</dd>
                      </div>
                    )}
                    {product.specifications.rear_tires && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Rear Tires</dt>
                        <dd className="text-sm text-gray-900">{product.specifications.rear_tires}</dd>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">Warranty Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-700">Quality Assured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-700">Premium Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
