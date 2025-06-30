"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Product {
  id: number;
  name: string;
  model: string;
  category: string;
  price: number;
  images: string[];
}

interface SearchFilters {
  category: string;
  min_price: string;
  max_price: string;
  in_stock: boolean | null;
  sort_by: string;
  sort_order: string;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onResults: (results: Product[]) => void;
  placeholder?: string;
}

export default function EnhancedSearch({
  onSearch,
  onResults,
  placeholder = "Search products, models, categories...",
}: EnhancedSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    min_price: "",
    max_price: "",
    in_stock: null,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Categories for filter dropdown
  const categories = [
    "E-Trike",
    "E-Bike",
    "E-Scooter",
    "Electric Vehicle",
    "Accessories",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (
    searchQuery: string,
    searchFilters: SearchFilters
  ) => {
    if (
      !searchQuery.trim() &&
      !Object.values(searchFilters).some((v) => v !== "" && v !== null)
    ) {
      setSuggestions([]);
      onResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (searchFilters.category)
        params.append("category", searchFilters.category);
      if (searchFilters.min_price)
        params.append("min_price", searchFilters.min_price);
      if (searchFilters.max_price)
        params.append("max_price", searchFilters.max_price);
      if (searchFilters.in_stock !== null)
        params.append("in_stock", searchFilters.in_stock.toString());
      params.append("sort_by", searchFilters.sort_by);
      params.append("sort_order", searchFilters.sort_order);

      const response = await fetch(`/api/products?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setSuggestions(result.data.slice(0, 5)); // Show top 5 suggestions
        onResults(result.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value, filters);
      onSearch(value, filters);
    }, 300);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    performSearch(query, updatedFilters);
    onSearch(query, updatedFilters);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onResults([]);
    onSearch("", filters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      category: "",
      min_price: "",
      max_price: "",
      in_stock: null,
      sort_by: "created_at",
      sort_order: "desc",
    };
    setFilters(defaultFilters);
    performSearch(query, defaultFilters);
    onSearch(query, defaultFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== null && v !== "created_at" && v !== "desc"
  );

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 ${hasActiveFilters ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && (
                  <Badge className="ml-1 h-4 px-1 text-xs bg-blue-500">
                    {
                      Object.values(filters).filter(
                        (v) =>
                          v !== "" &&
                          v !== null &&
                          v !== "created_at" &&
                          v !== "desc"
                      ).length
                    }
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange({ category: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.min_price}
                      onChange={(e) =>
                        handleFilterChange({ min_price: e.target.value })
                      }
                      className="h-9"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.max_price}
                      onChange={(e) =>
                        handleFilterChange({ max_price: e.target.value })
                      }
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={
                      filters.in_stock === null
                        ? ""
                        : filters.in_stock.toString()
                    }
                    onChange={(e) =>
                      handleFilterChange({
                        in_stock:
                          e.target.value === ""
                            ? null
                            : e.target.value === "true",
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Products</option>
                    <option value="true">In Stock Only</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={filters.sort_by}
                      onChange={(e) =>
                        handleFilterChange({ sort_by: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="created_at">Date Added</option>
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      value={filters.sort_order}
                      onChange={(e) =>
                        handleFilterChange({ sort_order: e.target.value })
                      }
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (query || suggestions.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-2">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setQuery(product.name);
                      setShowSuggestions(false);
                      onSearch(product.name, filters);
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0 overflow-hidden">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.model} • {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              query && (
                <div className="p-4 text-center text-gray-500">
                  <p>No products found for "{query}"</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange({ category: "" })}
              />
            </Badge>
          )}
          {filters.min_price && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min: {formatPrice(Number(filters.min_price))}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange({ min_price: "" })}
              />
            </Badge>
          )}
          {filters.max_price && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Max: {formatPrice(Number(filters.max_price))}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange({ max_price: "" })}
              />
            </Badge>
          )}
          {filters.in_stock !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.in_stock ? "In Stock" : "Out of Stock"}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange({ in_stock: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
