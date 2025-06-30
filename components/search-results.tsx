"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  category: string
  model: string
  images: string[]
  ideal_for?: string[]
  colors?: string[]
  in_stock: boolean
  featured: boolean
}

interface SearchResultsProps {
  searchQuery?: string
  filters?: any
  className?: string
}

export default function SearchResults({ searchQuery, filters, className = "" }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults()
    }
  }, [searchQuery, filters, sortBy, sortOrder])

  const fetchSearchResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (searchQuery) params.append("search", searchQuery)
      if (filters?.categories?.length > 0) params.append("category", filters.categories.join(","))
      if (filters?.priceRange?.[0] > 0) params.append("min_price", filters.priceRange[0].toString())
      if (filters?.priceRange?.[1] < 1000000) params.append("max_price", filters.priceRange[1].toString())
      if (filters?.inStock) params.append("in_stock", "true")
      if (filters?.featured) params.append("featured", "true")

      params.append("sort_by", sortBy)
      params.append("sort_order", sortOrder)

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
        setTotalResults(data.total)
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text
    const regex = new RegExp(`(${term})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-gray-600 mt-1">{loading ? "Searching..." : `${totalResults} products found`}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Options */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value: string) => {
              const [field, order] = value.split("-")
              setSortBy(field)
              setSortOrder(order as "asc" | "desc")
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price Low to High</SelectItem>
              <SelectItem value="price-desc">Price High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters?.categories?.length > 0 || filters?.inStock || filters?.featured) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          {filters.categories?.map((category: string) => (
            <Badge key={category} variant="secondary" className="capitalize">
              {category}
            </Badge>
          ))}
          {filters.inStock && <Badge variant="secondary">In Stock</Badge>}
          {filters.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Products Grid/List */}
      {!loading && products.length > 0 && (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className={`group hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex" : ""}`}
            >
              <CardContent className={`p-4 ${viewMode === "list" ? "flex gap-4 w-full" : ""}`}>
                <Link href={`/products/${product.id}`} className={viewMode === "list" ? "flex-shrink-0" : "block"}>
                  <div
                    className={`bg-gray-100 rounded-lg overflow-hidden ${viewMode === "list" ? "w-32 h-32" : "aspect-square mb-4"}`}
                  >
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={viewMode === "list" ? 128 : 300}
                        height={viewMode === "list" ? 128 : 300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/products/${product.id}`}>
                      <h3
                        className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(product.name, searchQuery || ""),
                        }}
                      />
                    </Link>
                    {product.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs ml-2">Featured</Badge>}
                  </div>

                  <p
                    className="text-sm text-gray-600 mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(product.description, searchQuery || ""),
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">₱{product.price.toLocaleString()}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₱{product.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Badge variant={product.in_stock ? "default" : "secondary"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    <span className="capitalize">{product.category}</span>
                    {product.model && <span> • {product.model}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `We couldn't find any products matching "${searchQuery}"`
              : "No products match your current filters"}
          </p>
          <Button variant="outline" onClick={() => (window.location.href = "/products")}>
            View All Products
          </Button>
        </div>
      )}
    </div>
  )
}
