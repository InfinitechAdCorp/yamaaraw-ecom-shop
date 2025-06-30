// Enhanced search API utilities
export interface SearchFilters {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  featured: boolean
}

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  sortBy?: string
  sortOrder?: "asc" | "desc"
  limit?: number
  page?: number
}

export async function searchProducts(options: SearchOptions) {
  const params = new URLSearchParams()

  if (options.query) params.append("search", options.query)
  if (options.filters?.categories?.length) {
    params.append("category", options.filters.categories.join(","))
  }
  if (options.filters?.priceRange && options.filters.priceRange[0] > 0) {
    params.append("min_price", options.filters.priceRange[0].toString())
  }
  if (options.filters?.priceRange && options.filters.priceRange[1] < 1000000) {
    params.append("max_price", options.filters.priceRange[1].toString())
  }
  if (options.filters?.inStock) params.append("in_stock", "true")
  if (options.filters?.featured) params.append("featured", "true")
  if (options.sortBy) params.append("sort_by", options.sortBy)
  if (options.sortOrder) params.append("sort_order", options.sortOrder)
  if (options.limit) params.append("limit", options.limit.toString())
  if (options.page) params.append("page", options.page.toString())

  const response = await fetch(`/api/products?${params.toString()}`)
  return response.json()
}

export async function getSearchSuggestions(query: string, limit = 5) {
  if (query.length < 2) return []

  const params = new URLSearchParams({
    search: query,
    limit: limit.toString(),
  })

  try {
    const response = await fetch(`/api/products?${params.toString()}`)
    const data = await response.json()
    return data.success ? data.data.slice(0, limit) : []
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return []
  }
}
