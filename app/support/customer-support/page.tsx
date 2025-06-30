import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Clock, Users, Headphones, FileText, MapPin } from "lucide-react"
import Link from "next/link"

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Headphones className="w-4 h-4 mr-2" />
              Customer Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">We're Here to Help</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get expert support for your YAMAARAW electric vehicles. Our dedicated team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
            <CardHeader className="text-center">
              <Phone className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-orange-600">Phone Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Speak directly with our support team</p>
              <a href="tel:09456754591" className="text-2xl font-bold text-orange-600 hover:text-orange-700">
                09456754591
              </a>
              <p className="text-sm text-gray-500 mt-2">Mon-Fri: 8AM-6PM</p>
              <p className="text-sm text-gray-500">Sat: 9AM-4PM</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
            <CardHeader className="text-center">
              <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-orange-600">Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Send us your questions anytime</p>
              <a
                href="mailto:support@yamaaraw.com"
                className="text-lg font-semibold text-orange-600 hover:text-orange-700"
              >
                support@yamaaraw.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </CardContent>
          </Card>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Users className="w-5 h-5 mr-2" />
                What We Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Product Information</h4>
                    <p className="text-gray-600 text-sm">Specifications, features, and compatibility</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Technical Support</h4>
                    <p className="text-gray-600 text-sm">Troubleshooting and maintenance guidance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Order Assistance</h4>
                    <p className="text-gray-600 text-sm">Order status, shipping, and delivery</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Warranty Claims</h4>
                    <p className="text-gray-600 text-sm">Warranty registration and claims process</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Parts & Accessories</h4>
                    <p className="text-gray-600 text-sm">Genuine parts ordering and availability</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Clock className="w-5 h-5 mr-2" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Phone Support</span>
                  <span className="text-gray-600">Mon-Fri: 8AM-6PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Saturday</span>
                  <span className="text-gray-600">9AM-4PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Email Support</span>
                  <span className="text-gray-600">24/7 (24hr response)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Emergency Support</span>
                  <span className="text-gray-600">24/7 for critical issues</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Sunday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

  
     
      </div>

      <Footer />
    </div>
  )
}
