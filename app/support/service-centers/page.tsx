"use client"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Wrench, Star } from 'lucide-react'

export default function ServiceCentersPage() {
  const serviceCenters = [
    {
      name: "YAMAARAW Manila Service Center",
      address: "123 EDSA, Makati City, Metro Manila",
      phone: "09456754591",
      hours: "Mon-Sat: 8AM-6PM",
      services: ["Repair", "Maintenance", "Parts", "Warranty"],
      rating: 4.8,
    },
    {
      name: "YAMAARAW Quezon City Branch",
      address: "456 Commonwealth Ave, Quezon City",
      phone: "09456754592",
      hours: "Mon-Fri: 9AM-5PM",
      services: ["Repair", "Maintenance", "Consultation"],
      rating: 4.7,
    },
    {
      name: "YAMAARAW Cebu Service Hub",
      address: "789 Colon Street, Cebu City",
      phone: "09456754593",
      hours: "Mon-Sat: 8AM-5PM",
      services: ["Repair", "Parts", "Warranty", "Training"],
      rating: 4.9,
    },
  ]

  const handleLocationClick = (address: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(googleMapsUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Wrench className="w-4 h-4 mr-2" />
              Service Centers
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Authorized Service Centers</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Find professional service and support for your YAMAARAW electric vehicles at our authorized centers.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Centers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serviceCenters.map((center, index) => (
            <Card key={index} className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-orange-600 text-lg">{center.name}</CardTitle>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold ml-1">{center.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <button
                    onClick={() => handleLocationClick(center.address)}
                    className="text-gray-600 hover:text-orange-600 transition-colors text-left cursor-pointer underline-offset-2 hover:underline"
                  >
                    {center.address}
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <a href={`tel:${center.phone}`} className="text-gray-600 hover:text-orange-600 transition-colors">
                    {center.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-600">{center.hours}</span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Services Available:</h4>
                  <div className="flex flex-wrap gap-2">
                    {center.services.map((service, serviceIndex) => (
                      <Badge key={serviceIndex} variant="secondary" className="bg-orange-100 text-orange-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Offered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Wrench className="w-5 h-5 mr-2" />
                Services We Provide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Regular Maintenance</h4>
                    <p className="text-gray-600 text-sm">Scheduled maintenance and tune-ups</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Battery Service</h4>
                    <p className="text-gray-600 text-sm">Battery testing, replacement, and optimization</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Motor Repair</h4>
                    <p className="text-gray-600 text-sm">Motor diagnostics and repair services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Parts Replacement</h4>
                    <p className="text-gray-600 text-sm">Genuine YAMAARAW parts and accessories</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Clock className="w-5 h-5 mr-2" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Professional Technicians</h4>
                    <p className="text-gray-600 text-sm">Certified and trained service professionals</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Genuine Parts</h4>
                    <p className="text-gray-600 text-sm">Only authentic YAMAARAW parts used</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Warranty Coverage</h4>
                    <p className="text-gray-600 text-sm">Service work covered under warranty</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Quick Turnaround</h4>
                    <p className="text-gray-600 text-sm">Efficient service with minimal downtime</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>


      
      </div>

      <Footer />
    </div>
  )
}
