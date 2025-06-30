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

interface TestimonialCarouselProps {
  testimonials: Array<{
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
  }>;
  speed?: number; // Animation duration in seconds
}

function TestimonialCard({
  testimonial,
  className = "",
}: {
  testimonial: TestimonialCarouselProps["testimonials"][0];
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 120;
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
      className={`group relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 flex-shrink-0 w-80 mx-4 ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 pointer-events-none" />

      <CardContent className="relative p-6 h-full flex flex-col">
        {/* Quote icon */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <Quote className="w-8 h-8 text-gray-400" />
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-all duration-200 ${
                  i < testimonial.rating
                    ? "text-amber-400 fill-current drop-shadow-sm"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 border-amber-200 font-semibold px-2 py-1 text-xs"
          >
            {testimonial.rating}.0
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {testimonial.title}
        </h3>

        {/* Message */}
        <div className="flex-1 mb-4">
          <p className="text-gray-700 leading-relaxed text-sm font-medium">
            "{displayMessage}"
          </p>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold hover:bg-transparent text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3 mr-1" />
                  More
                </>
              )}
            </Button>
          )}
        </div>

        {/* Product Info */}
        {testimonial.product && (
          <div className="mb-4">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors duration-200 px-2 py-1 text-xs font-medium">
              <Package className="w-3 h-3 mr-1" />
              {testimonial.product.name} - {testimonial.product.model}
            </Badge>
          </div>
        )}

        {/* Customer Info */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${getGradientColors(testimonial.rating)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white`}
              >
                {getInitials(testimonial.name)}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  {testimonial.name}
                </div>
                <div className="flex items-center text-gray-600 text-xs">
                  <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                  <span className="font-medium truncate max-w-32">
                    {testimonial.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(testimonial.created_at)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialCarousel({
  testimonials,
  speed = 30,
}: TestimonialCarouselProps) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Quote className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No testimonials yet
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Be the first to share your experience and help others discover what
          makes us special.
        </p>
      </div>
    );
  }

  // Duplicate testimonials to create seamless infinite scroll
  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

      <div
        className="flex animate-scroll-left hover:pause-animation"
        style={{
          animationDuration: `${speed}s`,
          width: `${duplicatedTestimonials.length * 320}px`,
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}
