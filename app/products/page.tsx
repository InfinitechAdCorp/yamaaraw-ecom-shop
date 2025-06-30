"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { Filter, Search, Grid, List, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ETrikeLoader from "@/components/ui/etrike-loader"
import { productApi, type ProductData } from "@/lib/api"
import { addToCart } from "@/lib/cart"
import { useClientToast } from "@/hooks/use-client-toast"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [sortBy, setSortBy] = useState("name")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [animatingProduct, setAnimatingProduct] = useState<number | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const toast = useClientToast()

  const categories = ["All Products", "E-Bike", "E-Trike", "E-Scooter", "E-Motorcycle", "E-Dump"]

  // Get category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl)
    } else if (categoryFromUrl) {
      // If category exists but not in our list, still set it
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory]) // Refetch when category changes

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedCategory, sortBy, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Option 1: Server-side filtering (recommended)
      // Pass category to API if it's not "All Products"
      const categoryParam = selectedCategory !== "All Products" ? selectedCategory : undefined
      const response = await productApi.getProducts({ category: categoryParam })

      // Option 2: Client-side filtering (fallback)
      // const response = await productApi.getProducts()

      const productsWithStock = response.map((product) => ({
        ...product,
        in_stock: Boolean(product.in_stock),
      }))

      console.log("Fetched products:", productsWithStock)
      setProducts(productsWithStock)
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback: fetch all products if category filtering fails
      try {
        const response = await productApi.getProducts()
        const productsWithStock = response.map((product) => ({
          ...product,
          in_stock: Boolean(product.in_stock),
        }))
        setProducts(productsWithStock)
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filtering (only if using client-side filtering)
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "featured":
          return b.featured ? 1 : -1
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString())
    if (category === "All Products") {
      params.delete("category")
    } else {
      params.set("category", category)
    }

    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products"
    router.push(newUrl, { scroll: false })
  }

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "₱0.00"
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price || !price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const handleAddToCart = async (product: ProductData, event: React.MouseEvent) => {
    try {
      setAnimatingProduct(product.id!)
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

        setTimeout(() => {
          animationEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`
          animationEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`
          animationEl.style.transform = "scale(0.5)"
          animationEl.style.opacity = "0"
        }, 100)

        setTimeout(() => {
          if (document.body.contains(animationEl)) {
            document.body.removeChild(animationEl)
          }
        }, 900)
      }

      await addToCart(product.id!, 1)

      // Show success toast
      toast.cartAdded(product.name)

      setAnimatingProduct(null)
      console.log("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to Add", "Could not add item to cart. Please try again.")
      setAnimatingProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Category Info */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
              Electric Mobility Solutions
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {selectedCategory === "All Products" ? "Our Products" : selectedCategory}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              {selectedCategory === "All Products"
                ? "Discover our complete range of electric vehicles designed for sustainable transportation"
                : `Explore our ${selectedCategory} collection`}
            </p>
            {selectedCategory !== "All Products" && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleCategoryChange("All Products")}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 md:mb-8 bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 md:h-12 rounded-lg border-2 border-orange-200 focus:border-orange-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-orange-200 hover:bg-orange-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200 hover:bg-orange-50"
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-orange-500 hover:bg-orange-600" : "border-orange-200 hover:bg-orange-50"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block mt-4 md:mt-6`}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={
                    selectedCategory === category
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-white hover:bg-orange-100 border-orange-200"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex flex-wrap gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "All Products" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Product Grid/List */}
        <div
          className={`grid gap-4 md:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
        >
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 hover:shadow-lg ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}`}
            >
              <CardContent className={`p-4 ${viewMode === "list" ? "flex flex-col sm:flex-row w-full gap-4" : ""}`}>
                <Link href={`/products/${product.id}`} className={viewMode === "list" ? "flex-shrink-0" : ""}>
                  <div className={`relative ${viewMode === "list" ? "w-full sm:w-32 h-48 sm:h-32" : "w-full h-48"}`}>
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes={
                        viewMode === "list"
                          ? "(max-width: 640px) 100vw, 128px"
                          : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      }
                    />

                    {/* Fixed Badge Positioning */}
                    <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1 justify-between">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <Badge className="bg-yellow-500 text-white text-xs px-2 py-1 shadow-sm">Featured</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.in_stock ? (
                          <Badge className="bg-green-500 text-white text-xs px-2 py-1 shadow-sm">In Stock</Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white text-xs px-2 py-1 shadow-sm">Out of Stock</Badge>
                        )}
                      </div>
                    </div>

                    {/* Discount Badge - Bottom Right */}
                    {product.original_price && calculateDiscount(product.price, product.original_price) > 0 && (
                      <Badge className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 shadow-sm">
                        {calculateDiscount(product.price, product.original_price)}% Off
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className={`${viewMode === "list" ? "flex-1 flex flex-col justify-between" : "mt-3"}`}>
                  <div>
                    <Link href={`/products/${product.id}`}>
                      <h2
                        className={`font-bold hover:text-orange-600 transition-colors line-clamp-2 ${viewMode === "list" ? "text-lg" : "text-lg md:text-xl"}`}
                      >
                        {product.name}
                      </h2>
                    </Link>
                  </div>

                  <div className={`${viewMode === "list" ? "mt-2" : "mt-3"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
                        {product.original_price && (
                          <p className="text-sm line-through text-gray-400">{formatPrice(product.original_price)}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.in_stock || animatingProduct === product.id}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-xs md:text-sm"
                    >
                      <ShoppingCart className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                      {animatingProduct === product.id ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 md:py-16">
            <div className="w-24 md:w-32 h-24 md:h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 md:w-16 h-12 md:h-16 text-orange-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-6 md:mb-8">
              {selectedCategory !== "All Products"
                ? `No products found in ${selectedCategory} category.`
                : "Try adjusting your search or filter criteria."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                handleCategoryChange("All Products")
              }}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
