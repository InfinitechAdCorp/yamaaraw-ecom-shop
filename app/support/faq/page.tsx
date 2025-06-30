"use client"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search, Battery, Zap, Settings, Shield } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const faqCategories = [
    {
      icon: Battery,
      title: "Battery & Charging",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      faqs: [
        {
          question: "How long does the battery last on a single charge?",
          answer:
            "Battery life varies by model, but typically ranges from 40-80km depending on terrain, rider weight, and usage patterns. Our E-Bikes can travel up to 60km, while E-Trikes can go up to 80km on a single charge.",
        },
        {
          question: "How long does it take to fully charge the battery?",
          answer:
            "Most YAMAARAW batteries take 4-6 hours to fully charge from empty. We recommend charging overnight for convenience. Fast charging options are available for select models.",
        },
        {
          question: "Can I charge the battery while it's still in the vehicle?",
          answer:
            "Yes, all our vehicles support in-place charging. You can also remove the battery for indoor charging if preferred. Always use the provided charger for safety.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Performance & Features",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      faqs: [
        {
          question: "What is the maximum speed of YAMAARAW vehicles?",
          answer:
            "Speed varies by model: E-Bikes reach up to 25km/h, E-Trikes up to 35km/h, and E-Motorcycles up to 60km/h. All speeds comply with local regulations.",
        },
        {
          question: "Can I ride in the rain?",
          answer:
            "Yes, our vehicles have IP65 water resistance rating, making them suitable for light rain. However, avoid deep water and always dry the vehicle after exposure to moisture.",
        },
        {
          question: "What's the weight capacity?",
          answer:
            "Weight capacity varies: E-Bikes support up to 120kg, E-Trikes up to 300kg (including cargo), and E-Dump models up to 500kg payload.",
        },
      ],
    },
    {
      icon: Settings,
      title: "Maintenance & Care",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      faqs: [
        {
          question: "How often should I service my YAMAARAW vehicle?",
          answer:
            "We recommend service every 3 months or 1,000km, whichever comes first. Regular maintenance includes battery check, brake inspection, and tire pressure adjustment.",
        },
        {
          question: "What maintenance can I do myself?",
          answer:
            "You can clean the vehicle, check tire pressure, inspect brakes, and keep the battery charged. For technical issues, always consult our authorized service centers.",
        },
        {
          question: "How do I store my vehicle long-term?",
          answer:
            "Store in a dry place, charge battery to 50-70%, and check monthly. Avoid extreme temperatures and direct sunlight for extended periods.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Warranty & Support",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      faqs: [
        {
          question: "What does the warranty cover?",
          answer:
            "Our warranty covers manufacturing defects: 2 years for battery, 3 years for motor, and 5 years for frame. Normal wear items like tires and brakes are not covered.",
        },
        {
          question: "How do I register my warranty?",
          answer:
            "Warranty registration is automatic upon purchase. Keep your receipt and contact our support team if you need warranty service.",
        },
        {
          question: "Where can I get spare parts?",
          answer:
            "Genuine YAMAARAW parts are available at all authorized service centers. We also offer online ordering for common replacement parts.",
        },
      ],
    },
  ]

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Find answers to common questions about YAMAARAW electric vehicles.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder-white/60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* FAQ Categories */}
        {filteredFAQs.map((category, categoryIndex) => {
          const IconComponent = category.icon
          return (
            <Card key={categoryIndex} className={`mb-8 border-2 ${category.borderColor} ${category.bgColor}`}>
              <CardHeader>
                <CardTitle className={`flex items-center ${category.color} text-xl`}>
                  <IconComponent className="w-6 h-6 mr-3" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* No Results */}
        {searchTerm && filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try different keywords or browse our categories above.</p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              Clear Search
            </Button>
          </div>
        )}

       
      
      </div>

      <Footer />
    </div>
  )
}
