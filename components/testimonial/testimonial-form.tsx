"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Send,
  CheckCircle,
  User,
  MapPin,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useETrikeToast } from "@/components/ui/toast-container";

interface Product {
  id: number;
  name: string;
  model: string;
}

interface TestimonialFormProps {
  products?: Product[];
  onSuccess?: () => void;
}

export default function TestimonialForm({
  products = [],
  onSuccess,
}: TestimonialFormProps) {
  const toast = useETrikeToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    title: "",
    message: "",
    product_id: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error(
        "Rating Required",
        "Please select a rating before submitting"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rating,
          product_id: formData.product_id || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        toast.success(
          "Thank You!",
          "Your testimonial has been submitted for review"
        );
        onSuccess?.();
      } else {
        throw new Error(result.message || "Failed to submit testimonial");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error(
        "Submission Failed",
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your testimonial has been submitted successfully. It will be
            reviewed and published soon.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                location: "",
                title: "",
                message: "",
                product_id: "",
              });
              setRating(0);
            }}
            variant="outline"
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
          Share Your Experience
        </CardTitle>
        <p className="text-gray-600">
          Help others by sharing your experience with our products and services
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Personal Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, Province"
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          {products.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">
                Product (Optional)
              </h4>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a product (optional)</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              Rating <span className="text-red-500">*</span>
            </h4>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <Badge variant="secondary" className="ml-4">
                  {rating} star{rating !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              Your Review
            </h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Title <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Summarize your experience in a few words"
                className="h-12"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Experience <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell us about your experience with our product or service. What did you like? How has it helped you?"
                rows={6}
                maxLength={1000}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </div>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            <p>
              By submitting this review, you agree that it may be published on
              our website and marketing materials. All reviews are subject to
              moderation and approval.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
