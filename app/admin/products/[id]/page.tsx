"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Truck,
  Award,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";

export default function ProductViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log("=== ProductViewPage mounted ===");
    console.log("Route params:", params);
    console.log("Product ID:", id);

    if (id) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching product with ID:", id);
      const response = await productApi.getProduct(Number(id));
      console.log("Product response:", response);
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images!.length) % product.images!.length
      );
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price);
  };

  const handleEdit = () => {
    router.push(`/admin/products?edit=${id}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(Number(id));
        router.push("/admin/products");
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleBack = () => {
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ETrikeLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error || "Product not found"}
              <br />
              <span className="text-sm">Product ID: {id}</span>
              <br />
              <span className="text-xs">Route: /admin/products/{id}</span>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Products
              </Button>
              <div>
                <Badge className="mb-2 bg-white/20 text-white border-white/30">
                  Product Details
                </Badge>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {product.name}
                </h1>
                <p className="text-orange-100">{product.model}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleEdit}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                className="text-white hover:bg-red-500/20"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={
                    product.images?.[currentImageIndex] || "/placeholder.svg"
                  }
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-20 shadow-lg">
                    -{discount}%
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center z-20 shadow-lg">
                    <Star className="w-4 h-4 mr-1" />
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
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index
                          ? "border-orange-500"
                          : "border-gray-200"
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

            {/* Right Side - Product Info */}
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-3">
                  {product.category}
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-lg text-gray-600 mb-4">{product.model}</p>

                {/* Price */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </div>
                  {product.original_price &&
                    product.original_price > product.price && (
                      <div className="text-xl text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </div>
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
                    <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
                      ⭐ Featured Product
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
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
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm text-gray-700">
                            {color.name}
                          </span>
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
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-blue-200 text-blue-600"
                        >
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl">
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {product.specifications.dimensions && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Dimensions
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.dimensions}
                      </dd>
                    </div>
                  )}
                  {product.specifications.battery_type && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Battery Type
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.battery_type}
                      </dd>
                    </div>
                  )}
                  {product.specifications.motor_power && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Motor Power
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.motor_power}
                      </dd>
                    </div>
                  )}
                  {product.specifications.main_features && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Main Features
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.main_features}
                      </dd>
                    </div>
                  )}
                  {product.specifications.front_rear_suspension && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Suspension
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.front_rear_suspension}
                      </dd>
                    </div>
                  )}
                  {product.specifications.front_tires && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Front Tires
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.front_tires}
                      </dd>
                    </div>
                  )}
                  {product.specifications.rear_tires && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-1">
                        Rear Tires
                      </dt>
                      <dd className="text-sm text-gray-900 font-semibold">
                        {product.specifications.rear_tires}
                      </dd>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Highlights */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Service Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Warranty Included
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Free Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Award className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Quality Assured
                  </span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Star className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="text-sm text-gray-700 font-medium">
                    Premium Support
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
