"use client";

import TestimonialCard from "./testimonial-card";
import { Star, MessageSquare } from "lucide-react";

interface TestimonialGridProps {
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
  loading?: boolean;
}

export default function TestimonialGrid({
  testimonials,
  loading = false,
}: TestimonialGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl h-96 shadow-sm"></div>
          </div>
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <MessageSquare className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No testimonials yet
        </h3>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Be the first to share your experience and help others discover what
          makes us special.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          className={`animate-fade-in-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
