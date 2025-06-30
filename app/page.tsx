"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Zap, Shield, Truck, Play, Gift, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ProductGrid from "@/components/product/product-grid"
import HeroImageSlider from "@/components/ui/hero-image-slider"
import TestimonialForm from "@/components/testimonial/testimonial-form"
import ETrikeLoader from "@/components/ui/etrike-loader"
import TestimonialCarousel from "@/components/testimonial/testimonial-carousel"

interface FeaturedProduct {
  id: number
  name: string
  model: string
  category: string
  price: number
  original_price?: number
  images: string[]
  featured: boolean
  in_stock: boolean
  description: string
}

interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  title: string
  message: string
  created_at: string
  product?: {
    name: string
    model: string
  }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch featured products and testimonials in parallel
      const [productsResponse, testimonialsResponse] = await Promise.all([
        fetch("/api/getfeatured"),
        fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/testimonials?featured=true`),
      ])

      console.log("Products response status:", productsResponse.status)
      console.log("Testimonials response status:", testimonialsResponse.status)

      if (productsResponse.ok) {
        const productsResult = await productsResponse.json()
        console.log("Products result:", productsResult)

        if (productsResult.success) {
          setFeaturedProducts(productsResult.data || [])
        }
      } else {
        console.error("Failed to fetch products:", productsResponse.status)
      }

      if (testimonialsResponse.ok) {
        const testimonialsResult = await testimonialsResponse.json()
        console.log("Testimonials result:", testimonialsResult)

        if (testimonialsResult.success) {
          // Get the first 3 testimonials for homepage display
          setTestimonials(testimonialsResult.data?.data?.slice(0, 3) || [])
        }
      } else {
        console.error("Failed to fetch testimonials:", testimonialsResponse.status)
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mobile: Image First, Desktop: Text First */}
            <div className="order-2 lg:order-1 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  🔥 Flash Sale - Up to 50% OFF
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Electric Mobility
                  </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                  Experience premium electric vehicles designed for modern urban transport, eco-conscious commuting, and
                  sustainable living.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg font-semibold"
                >
                  <Link href="/products" className="flex items-center">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50K+</div>
                  <div className="text-sm text-slate-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">100+</div>
                  <div className="text-sm text-slate-300">Service Centers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">2 Years</div>
                  <div className="text-sm text-slate-300">Warranty</div>
                </div>
              </div>
            </div>

            {/* Mobile: Image First, Desktop: Image Second */}
            <div className="relative h-80 lg:h-96 order-1 lg:order-2">
              <HeroImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Gift className="w-6 h-6 animate-bounce" />
            <span className="font-bold text-lg">MEGA SALE</span>
            <span className="text-orange-200">•</span>
            <span>Free Shipping on Orders Over ₱50,000</span>
            <span className="text-orange-200">•</span>
            <span>2-Year Warranty Included</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Why Choose YAMAARAW</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Built for Excellence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering smart, sustainable, and high-performance electric mobility solutions that
              exceed expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">High Performance</h3>
              <p className="text-gray-600 leading-relaxed">
                Ultra-silent motors with impressive range up to 100km per charge. Advanced battery technology for
                reliable performance.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-xl transition-all duration-300 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Reliable & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with premium materials and advanced safety features. Rigorous testing ensures maximum reliability
                and durability.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-xl transition-all duration-300 border border-red-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Nationwide Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive after-sales support and service centers across the Philippines. 24/7 customer assistance
                available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Featured Collection</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Most Popular Vehicles</h2>
            <p className="text-lg text-gray-600">Discover our best-selling electric vehicles loved by thousands</p>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <ProductGrid products={featuredProducts} />
              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg font-semibold"
                >
                  <Link href="/products" className="flex items-center">
                    View All Products <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
              <Button
                asChild
                className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Customer Reviews</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real experiences from our satisfied customers</p>
          </div>

          {/* Toggle between testimonials and form */}
          <div className="text-center mb-12">
            <Button
              onClick={() => setShowTestimonialForm(!showTestimonialForm)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold"
              size="lg"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              {showTestimonialForm ? "View Reviews" : "Write a Review"}
            </Button>
          </div>

          {showTestimonialForm ? (
            /* Testimonial Form */
            <div className="max-w-4xl mx-auto">
              <TestimonialForm
                products={featuredProducts}
                onSuccess={() => {
                  setShowTestimonialForm(false)
                  fetchData() // Refresh testimonials
                }}
              />
            </div>
          ) : (
            /* Display Testimonials Carousel */
            <div>
              <TestimonialCarousel
                testimonials={
                  testimonials.length > 0
                    ? testimonials
                    : [
                        {
                          id: 1,
                          name: "Maria Santos",
                          location: "Manila",
                          rating: 5,
                          title: "Absolutely thrilled with my new e-trike",
                          message:
                            "I chose the e-trike for its unmatched stability and comfort—especially living in a hilly area and it has exceeded all expectations. Riding uphill used to be a struggle, but now I easily zip up inclines with pedal assist, and the spacious basket handles my groceries with zero hassle.",
                          created_at: "2025-06-26T00:00:00Z",
                          product: {
                            name: "V9 E-trike",
                            model: "V9",
                          },
                        },
                        {
                          id: 2,
                          name: "Juan Dela Cruz",
                          location: "ABIC Realty and Consultancy Corporation",
                          rating: 5,
                          title: "Good Service",
                          message:
                            "The Service they have is good, employees are very approachable and helpful. Would definitely recommend to others looking for quality products.",
                          created_at: "2025-06-26T00:00:00Z",
                          product: {
                            name: "V9 E-trike",
                            model: "V9",
                          },
                        },
                        {
                          id: 3,
                          name: "Emily Rodriguez",
                          location: "Downtown District",
                          rating: 5,
                          title: "Perfect for daily commuting",
                          message:
                            "This e-trike has completely transformed my daily commute. The battery life is excellent, and the ride is so smooth. I love how stable it feels even when carrying heavy loads.",
                          created_at: "2025-06-25T00:00:00Z",
                          product: {
                            name: "V9 E-trike",
                            model: "V9",
                          },
                        },
                        {
                          id: 4,
                          name: "Carlos Mendoza",
                          location: "Davao City",
                          rating: 5,
                          title: "Excellent build quality",
                          message:
                            "The build quality is outstanding. Very sturdy and reliable for daily use. The customer service team was also very helpful throughout the purchase process.",
                          created_at: "2025-06-22T00:00:00Z",
                          product: {
                            name: "V9 E-trike",
                            model: "V9",
                          },
                        },
                        {
                          id: 5,
                          name: "Lisa Chen",
                          location: "Makati City",
                          rating: 5,
                          title: "Great investment for the environment",
                          message:
                            "Love that I'm contributing to a cleaner environment while saving on fuel costs. The e-trike is whisper quiet and very comfortable to ride.",
                          created_at: "2025-06-20T00:00:00Z",
                          product: {
                            name: "V9 E-trike",
                            model: "V9",
                          },
                        },
                      ]
                }
                speed={40}
              />

             
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Go Electric?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made the switch to sustainable transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
