"use client";

import { useState } from "react";
import {
  Star,
  Eye,
  Trash2,
  CheckCircle,
  Award,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ETrikeLoader from "@/components/ui/etrike-loader";

interface Testimonial {
  id: number;
  name: string;
  email: string;
  location: string;
  rating: number;
  title: string;
  message: string;
  product_id?: number;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  product?: {
    name: string;
    model: string;
  };
}

interface TestimonialTableProps {
  testimonials: Testimonial[];
  loading: boolean;
  onApprove: (id: number) => void;
  onToggleFeatured: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TestimonialTable({
  testimonials,
  loading,
  onApprove,
  onToggleFeatured,
  onDelete,
}: TestimonialTableProps) {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <ETrikeLoader />
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Testimonials Found
        </h3>
        <p className="text-gray-600">
          Customer reviews will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Review
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {testimonial.location}
                        </div>
                        <div className="text-xs text-gray-400">
                          {testimonial.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {testimonial.title}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {truncateText(testimonial.message)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {testimonial.product ? (
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {testimonial.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {testimonial.product.model}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        General Review
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {testimonial.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <Badge
                        className={
                          testimonial.is_approved
                            ? "bg-green-100 text-green-600 border-green-200"
                            : "bg-yellow-100 text-yellow-600 border-yellow-200"
                        }
                      >
                        {testimonial.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      {testimonial.is_featured && (
                        <Badge className="bg-purple-100 text-purple-600 border-purple-200 text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(testimonial.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTestimonial(testimonial)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!testimonial.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onApprove(testimonial.id)}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleFeatured(testimonial.id)}
                        className={
                          testimonial.is_featured
                            ? "border-purple-200 text-purple-600 hover:bg-purple-50"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }
                        title={
                          testimonial.is_featured
                            ? "Remove from Featured"
                            : "Mark as Featured"
                        }
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(testimonial.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete"
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
      </div>

      {/* Testimonial Detail Modal */}
      {selectedTestimonial && (
        <Dialog
          open={!!selectedTestimonial}
          onOpenChange={() => setSelectedTestimonial(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(selectedTestimonial.name)}
                </div>
                <span>Testimonial Details</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium">
                      {selectedTestimonial.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium">
                      {selectedTestimonial.email}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <div className="font-medium">
                      {selectedTestimonial.location}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <div className="font-medium">
                      {formatDate(selectedTestimonial.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Rating</h4>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < selectedTestimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium text-gray-600">
                    {selectedTestimonial.rating}/5
                  </span>
                </div>
              </div>

              {/* Product */}
              {selectedTestimonial.product && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Product</h4>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {selectedTestimonial.product.name} -{" "}
                    {selectedTestimonial.product.model}
                  </Badge>
                </div>
              )}

              {/* Review */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Review</h4>
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    {selectedTestimonial.title}
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    "{selectedTestimonial.message}"
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <div className="flex space-x-2">
                  <Badge
                    className={
                      selectedTestimonial.is_approved
                        ? "bg-green-100 text-green-600 border-green-200"
                        : "bg-yellow-100 text-yellow-600 border-yellow-200"
                    }
                  >
                    {selectedTestimonial.is_approved
                      ? "Approved"
                      : "Pending Approval"}
                  </Badge>
                  {selectedTestimonial.is_featured && (
                    <Badge className="bg-purple-100 text-purple-600 border-purple-200">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
