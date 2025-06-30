"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductForm from "@/components/admin/product-form";
import ProductTable from "@/components/admin/product-table";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editId) {
      handleEditById(Number(editId));
    }
  }, [editId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
      };

      const response = await productApi.getProducts(params);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditById = async (id: number) => {
    try {
      const product = await productApi.getProduct(id);
      setEditingProduct(product);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      setError("Failed to fetch product for editing.");
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(id);
        await fetchProducts(); // Refresh the list
        setError(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: ProductData | FormData) => {
    try {
      setError(null);

      if (editingProduct && editingProduct.id) {
        await productApi.updateProduct(editingProduct.id, data);
      } else {
        await productApi.createProduct(data);
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleExport = () => {
    // Convert products to CSV
    const headers = [
      "Name",
      "Model",
      "Category",
      "Price",
      "Original Price",
      "In Stock",
      "Featured",
    ];
    const csvContent = [
      headers.join(","),
      ...products.map((product) =>
        [
          `"${product.name}"`,
          `"${product.model}"`,
          `"${product.category}"`,
          product.price,
          product.original_price || "",
          product.in_stock ? "Yes" : "No",
          product.featured ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const categories = ["All", "E-Bike", "E-Trike", "E-Scooter", "E-Motorcycle"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Admin Dashboard
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Product Management
              </h1>
              <p className="text-orange-100">
                Manage your electric vehicle inventory
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleCreateProduct}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-10 rounded-lg border-2 border-orange-200 focus:border-orange-500"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border-2 border-orange-200 focus:border-orange-500 bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleSearch}
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                disabled={loading}
              >
                <Filter className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                onClick={handleExport}
                disabled={products.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200">
                {products.length} Product{products.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ETrikeLoader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No products found
              </div>
              <Button
                onClick={handleCreateProduct}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <ProductTable
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      </section>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
}
