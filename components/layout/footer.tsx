import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

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
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-orange-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=Electric Bicycles"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Electric Bicycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Electric Tricycles"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Electric Tricycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Electric Motorcycles"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Electric Motorcycles
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Solar-Powered Bicycles"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
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
                  href="/support"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/service"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Service Centers
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
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
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">Manila, Philippines</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">+63 (02) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300">info@yamaaraw.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 YAMAARAW. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
