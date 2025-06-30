"use client";

import { useState } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Package,
  Quote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    rating: number;
    title: string;
    message: string;
    created_at: string;
    product?: {
      name: string;
      model: string;
    };
  };
  className?: string;
  style?: React.CSSProperties;
}

export default function TestimonialCard({
  testimonial,
  className = "",
  style,
}: TestimonialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 150;
  const shouldTruncate = testimonial.message.length > maxLength;

  const displayMessage =
    isExpanded || !shouldTruncate
      ? testimonial.message
      : testimonial.message.substring(0, maxLength) + "...";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getGradientColors = (rating: number) => {
    if (rating >= 5) return "from-emerald-500 to-teal-600";
    if (rating >= 4) return "from-blue-500 to-cyan-600";
    if (rating >= 3) return "from-amber-500 to-orange-600";
    return "from-gray-500 to-slate-600";
  };

  return (
    <Card
      className={`group relative overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-[1.02] ${className}`}
      style={style}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 pointer-events-none" />

      <CardContent className="relative p-8 h-full flex flex-col">
        {/* Quote icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Quote className="w-12 h-12 text-gray-400" />
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 transition-all duration-200 ${
                  i < testimonial.rating
                    ? "text-amber-400 fill-current drop-shadow-sm"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 border-amber-200 font-semibold px-3 py-1"
          >
            {testimonial.rating}.0
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {testimonial.title}
        </h3>

        {/* Message */}
        <div className="flex-1 mb-6">
          <p className="text-gray-700 leading-relaxed text-base font-medium">
            "{displayMessage}"
          </p>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold hover:bg-transparent"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Read More
                </>
              )}
            </Button>
          )}
        </div>

        {/* Product Info */}
        {testimonial.product && (
          <div className="mb-6">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200 px-3 py-2 font-medium">
              <Package className="w-4 h-4 mr-2" />
              {testimonial.product.name} - {testimonial.product.model}
            </Badge>
          </div>
        )}

        {/* Customer Info */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${getGradientColors(testimonial.rating)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white`}
              >
                {getInitials(testimonial.name)}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {testimonial.name}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="font-medium">{testimonial.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(testimonial.created_at)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
