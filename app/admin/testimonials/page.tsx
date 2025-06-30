"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Download,
  AlertCircle,
  Eye,
  Trash2,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getAuthToken } from "@/lib/auth";
import { useETrikeToast } from "@/components/ui/toast-container";

interface Testimonial {
  id: number;
  name: string;
  email: string;
  location: string;
  rating: number;
  title: string;
  message: string;
  is_approved: boolean;
  is_featured: boolean;
  product_id: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
  };
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const toast = useETrikeToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchTestimonials();
  }, [router]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") {
        params.append(
          "approved",
          statusFilter === "approved" ? "true" : "false"
        );
      }
      if (ratingFilter !== "all") {
        params.append("min_rating", ratingFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/testimonials?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Handle Laravel pagination response structure
        const paginatedData = result.data;
        setTestimonials(
          Array.isArray(paginatedData.data) ? paginatedData.data : []
        );
        setCurrentPage(paginatedData.current_page || 1);
        setTotalPages(paginatedData.last_page || 1);
        setTotalCount(paginatedData.total || 0);
      } else {
        throw new Error(result.message || "Failed to fetch testimonials");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Failed to fetch testimonials. Please try again.");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/testimonials/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Success", "Testimonial approved successfully");
        await fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to approve testimonial");
      }
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast.error("Error", "Failed to approve testimonial");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/testimonials/${id}/toggle-featured`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Success", "Testimonial featured status updated");
        await fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to update testimonial");
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Error", "Failed to update testimonial");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this testimonial? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Success", "Testimonial deleted successfully");
        await fetchTestimonials();
      } else {
        throw new Error(result.message || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Error", "Failed to delete testimonial");
    }
  };

  const handleExport = () => {
    const headers = [
      "Customer",
      "Email",
      "Location",
      "Rating",
      "Title",
      "Message",
      "Status",
      "Product",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...testimonials.map((testimonial) =>
        [
          `"${testimonial.name}"`,
          `"${testimonial.email}"`,
          `"${testimonial.location}"`,
          testimonial.rating,
          `"${testimonial.title}"`,
          `"${testimonial.message.replace(/"/g, '""')}"`,
          `"${testimonial.is_approved ? "Approved" : "Pending"}"`,
          `"${testimonial.product?.name || "N/A"}"`,
          `"${new Date(testimonial.created_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testimonials-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (isApproved: boolean) => {
    return isApproved ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Clock className="w-4 h-4" />
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const filteredTestimonials = Array.isArray(testimonials)
    ? testimonials.filter((testimonial) => {
        const matchesSearch =
          testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "approved" && testimonial.is_approved) ||
          (statusFilter === "pending" && !testimonial.is_approved);

        const matchesRating =
          ratingFilter === "all" ||
          testimonial.rating.toString() === ratingFilter;
        return matchesSearch && matchesStatus && matchesRating;
      })
    : [];

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTestimonials = testimonials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, ratingFilter]);

  const statuses = ["all", "approved", "pending"];
  const ratings = ["all", "5", "4", "3", "2", "1"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
                Testimonial Management
              </h1>
              <p className="text-purple-100">
                Manage customer reviews and testimonials
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <MessageSquare className="w-8 h-8" />
              </div>
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

      {/* Stats Cards */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Approved</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(testimonials)
                        ? testimonials.filter((t) => t.is_approved).length
                        : 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(testimonials)
                        ? testimonials.filter((t) => !t.is_approved).length
                        : 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Featured</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(testimonials)
                        ? testimonials.filter((t) => t.is_featured).length
                        : 0}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg border-2 border-purple-200 focus:border-purple-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border-2 border-purple-200 focus:border-purple-500 bg-white min-w-[150px]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border-2 border-purple-200 focus:border-purple-500 bg-white min-w-[150px]"
              >
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating === "all"
                      ? "All Ratings"
                      : `${rating} Star${rating !== "1" ? "s" : ""}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
                onClick={handleExport}
                disabled={testimonials.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Badge className="bg-purple-100 text-purple-600 border-purple-200">
                {testimonials.length} Testimonial
                {testimonials.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No testimonials found
              </h3>
              <p className="text-gray-600">
                No testimonials match your current filters.
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    Testimonials ({totalCount})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, testimonials.length)} of {totalCount}{" "}
                  testimonials
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Customer
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Rating
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Review
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Product
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Date
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTestimonials.map((testimonial) => (
                        <tr
                          key={testimonial.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {testimonial.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {testimonial.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {testimonial.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {testimonial.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              {renderStars(testimonial.rating)}
                              <span className="ml-2 text-sm font-medium text-gray-600">
                                ({testimonial.rating})
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900 truncate">
                                {testimonial.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {testimonial.message}
                              </div>
                              {testimonial.is_featured && (
                                <Badge className="mt-1 bg-yellow-100 text-yellow-600 border-yellow-200 text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {testimonial.product?.name || "N/A"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={
                                testimonial.is_approved ? "approved" : "pending"
                              }
                              onChange={(e) => handleApprove(testimonial.id)}
                              disabled={updatingStatus === testimonial.id}
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                testimonial.is_approved
                              )} ${updatingStatus === testimonial.id ? "opacity-50" : ""}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(
                                  testimonial.created_at
                                ).toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/admin/testimonials/${testimonial.id}`
                                  )
                                }
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleToggleFeatured(testimonial.id)
                                }
                                className={`border-yellow-200 text-yellow-600 hover:bg-yellow-50 ${
                                  testimonial.is_featured ? "bg-yellow-50" : ""
                                }`}
                                title={
                                  testimonial.is_featured
                                    ? "Remove from featured"
                                    : "Add to featured"
                                }
                              >
                                <Star
                                  className={`w-4 h-4 ${testimonial.is_featured ? "fill-current" : ""}`}
                                />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(testimonial.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {/* First page */}
                          {currentPage > 3 && (
                            <>
                              <Button
                                variant={
                                  1 === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                className="w-10 h-10 p-0"
                              >
                                1
                              </Button>
                              {currentPage > 4 && (
                                <span className="text-gray-400">...</span>
                              )}
                            </>
                          )}

                          {/* Current page and surrounding pages */}
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNumber =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (pageNumber > totalPages) return null;

                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    pageNumber === currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNumber)}
                                  className="w-10 h-10 p-0"
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}

                          {/* Last page */}
                          {currentPage < totalPages - 2 && (
                            <>
                              {currentPage < totalPages - 3 && (
                                <span className="text-gray-400">...</span>
                              )}
                              <Button
                                variant={
                                  totalPages === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                className="w-10 h-10 p-0"
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Next Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
