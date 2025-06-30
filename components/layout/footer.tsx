import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative w-32 h-20">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon512_rounded-safg1LzoahqWqivLvcDAdfp4KB9a7G.png"
                alt="YAMAARAW"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm">
              Leading innovator in electric mobility solutions across Asia and
              beyond. Delivering smart, sustainable, and high-performance
              electric vehicles.
            </p>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=E-Bike"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Electric Bicycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=E-Trike"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Electric Tricycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=E-Motorcycle"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Electric Motorcycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=E-Dump"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Electric Dump Truck Tricycle
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/support/customer-support"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/support/warranty"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/support/service-centers"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  Service Centers
                </Link>
              </li>
              <li>
                <Link
                  href="/support/faq"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-1" />
                <div>
                  <a
                    href="https://www.google.com/maps?q=DRT+Highway,+Brgy.+Cutcot,+Pulilan,+Bulacan,+Philippines"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    DRT Highway, Brgy. Cutcot,<br />
                    Pulilan, Bulacan, Philippines
                  </a>
                  
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <a
                    href="tel:09456754591"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    09456754591
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <a
                  href="mailto:info@yamaaraw.com"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                >
                  info@yamaaraw.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 YAMAARAW. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
