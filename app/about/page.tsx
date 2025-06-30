"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Zap,
  Globe,
  Target,
  Award,
  Users,
  Leaf,
  Shield,
  Building2,
  CheckCircle,
  Star,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ETrikeLoader from "@/components/ui/etrike-loader"

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const achievements = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: <Users className="w-6 h-6" />,
      description: "Satisfied customers across the Philippines",
    },
    {
      number: "100+",
      label: "Service Centers",
      icon: <Building2 className="w-6 h-6" />,
      description: "Nationwide service and support network",
    },
    {
      number: "5+",
      label: "Product Lines",
      icon: <Zap className="w-6 h-6" />,
      description: "Diverse electric vehicle solutions",
    },
    {
      number: "2025",
      label: "Year Founded",
      icon: <Calendar className="w-6 h-6" />,
      description: "Leading the electric revolution",
    },
  ]

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "Zero emissions, sustainable transportation solutions for a cleaner future.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliable Quality",
      description: "Premium materials and rigorous testing ensure maximum durability.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High Performance",
      description: "Advanced battery technology with impressive range and power.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning",
      description: "Recognized excellence in electric mobility innovation.",
    },
  ]

  const products = [
    {
      title: "Electric Bicycles",
      description: "High-performance e-bikes for urban commuting and recreation",
      features: ["Long Range Battery", "Smart Connectivity", "Lightweight Design"],
    },
    {
      title: "Electric Tricycles",
      description: "Versatile three-wheelers perfect for passenger and cargo transport",
      features: ["Heavy Duty Build", "Comfortable Ride", "Commercial Grade"],
    },
    {
      title: "Solar-Powered Vehicles",
      description: "Eco-friendly transportation powered by renewable solar energy",
      features: ["Solar Charging", "Zero Emissions", "Energy Efficient"],
    },
    {
      title: "Commercial Vehicles",
      description: "Heavy-duty electric vehicles designed for business applications",
      features: ["Industrial Strength", "High Capacity", "Reliable Performance"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ETrikeLoader />
        </div>
      ) : (
        <>
          <Header />

          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-24">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-4xl mx-auto">
                <Badge className="mb-6 bg-orange-500/20 text-orange-300 border-orange-400/30 backdrop-blur-sm">
                  About YAMAARAW
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Leading the
                  <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                    Electric Revolution
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed mb-8">
                  Glory Bright International Energy Corp - Pioneering sustainable transportation solutions with
                  cutting-edge electric mobility technology since 2025.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <Link href="/products" className="flex items-center">
                      <Zap className="mr-2 w-5 h-5" />
                      Our Products
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/contact" className="flex items-center">
                      <Users className="mr-2 w-5 h-5" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div>
                  <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Our Story</Badge>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Transforming Transportation for a Sustainable Future
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      <strong className="text-orange-600">Glory Bright International Energy Corp</strong> was
                      established in 2025 with a clear mission: to revolutionize transportation through innovative
                      electric mobility solutions.
                    </p>
                    <p>
                      We recognized the urgent need for sustainable, efficient, and accessible transportation that
                      doesn't compromise on performance or affordability. Our commitment to excellence has made us a
                      trusted leader in the electric vehicle industry.
                    </p>
                    <p className="text-orange-600 font-semibold">
                      Today, we proudly serve over 50,000 customers across the Philippines and continue to expand our
                      impact globally.
                    </p>
                  </div>
                </div>

                {/* Achievement Cards */}
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                          {achievement.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{achievement.number}</div>
                        <div className="text-sm font-semibold text-orange-600 mb-2">{achievement.label}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Our Purpose</Badge>
                <h2 className="text-4xl font-bold text-gray-900">Mission & Vision</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mission */}
                <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white border-0 shadow-xl">
                  <CardContent className="p-10">
                    <div className="flex items-center mb-6">
                      <Target className="w-8 h-8 mr-3 text-orange-200" />
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p className="text-lg text-orange-100 leading-relaxed">
                      To provide smart, sustainable, and powerful electric mobility solutions that improve lives,
                      protect the environment, and make clean transportation accessible to everyone across the
                      Philippines and beyond.
                    </p>
                  </CardContent>
                </Card>

                {/* Vision */}
                <Card className="bg-gradient-to-br from-red-600 to-orange-600 text-white border-0 shadow-xl">
                  <CardContent className="p-10">
                    <div className="flex items-center mb-6">
                      <Globe className="w-8 h-8 mr-3 text-red-200" />
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                    </div>
                    <p className="text-lg text-red-100 leading-relaxed">
                      To be the leading innovator in new energy transportation across Asia, creating a world where
                      sustainable mobility is the standard, driving positive change for future generations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Why Choose YAMAARAW</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Excellence</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're committed to delivering smart, sustainable, and high-performance electric mobility solutions
                  that exceed expectations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-white border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Product Portfolio */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">Product Portfolio</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Electric Solutions</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive range of electric vehicles designed for every need and lifestyle
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.map((product, index) => (
                  <Card
                    key={index}
                    className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                      <div className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Link href="/products" className="flex items-center">
                    View All Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Go Electric?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who have made the switch to sustainable transportation. Discover
                our innovative electric vehicles and be part of the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-2xl"
                >
                  <Link href="/products" className="flex items-center">
                    <Zap className="mr-2 w-5 h-5" />
                    Explore Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 shadow-2xl bg-transparent"
                >
                  <Link href="/contact" className="flex items-center">
                    <Users className="mr-2 w-5 h-5" />
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  )
}
