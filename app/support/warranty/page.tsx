import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertCircle, FileText, Calendar, Phone } from 'lucide-react'

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Shield className="w-4 h-4 mr-2" />
              Warranty Information
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Warranty</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive warranty coverage for your YAMAARAW electric vehicles. Your investment is protected.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warranty Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-700">Battery Warranty</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2 Years</div>
              <p className="text-gray-600">Full battery replacement coverage</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-700">Motor Warranty</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3 Years</div>
              <p className="text-gray-600">Motor and electrical components</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-orange-700">Frame Warranty</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5 Years</div>
              <p className="text-gray-600">Frame and structural components</p>
            </CardContent>
          </Card>
        </div>

        {/* What's Covered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                What's Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Manufacturing Defects</h4>
                    <p className="text-gray-600 text-sm">Defects in materials and workmanship</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Battery Performance</h4>
                    <p className="text-gray-600 text-sm">Battery capacity below 70% within warranty period</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Motor Failure</h4>
                    <p className="text-gray-600 text-sm">Motor malfunction under normal use</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Electrical Components</h4>
                    <p className="text-gray-600 text-sm">Controller, display, and wiring issues</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                What's Not Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Physical Damage</h4>
                    <p className="text-gray-600 text-sm">Damage from accidents, drops, or misuse</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Water Damage</h4>
                    <p className="text-gray-600 text-sm">Damage from submersion or excessive moisture</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Wear and Tear</h4>
                    <p className="text-gray-600 text-sm">Normal wear items like tires, brakes, chains</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Unauthorized Repairs</h4>
                    <p className="text-gray-600 text-sm">Repairs not performed by authorized service centers</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Warranty Process */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Calendar className="w-5 h-5 mr-2" />
              How to Claim Warranty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Contact Support</h4>
                <p className="text-gray-600 text-sm">Call or email our support team with your issue</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Provide Details</h4>
                <p className="text-gray-600 text-sm">Share purchase receipt and describe the problem</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Assessment</h4>
                <p className="text-gray-600 text-sm">Our technicians will evaluate your claim</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold mb-2">Resolution</h4>
                <p className="text-gray-600 text-sm">Repair or replacement as per warranty terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        
      </div>

      <Footer />
    </div>
  )
}
