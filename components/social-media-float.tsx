"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { Facebook, Instagram, MessageCircle, Phone, Mail, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SocialMediaFloat() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  // Don't render on admin pages
  if (pathname.includes("/admin")) {
    return null
  }

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/people/Yamaaraw-E-bike-Shop/61577170012049/",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/yamaaraw",
      color: "bg-pink-600 hover:bg-pink-700",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/639171234567",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Call Us",
      icon: Phone,
      url: "tel:+639456754591",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:info@yamaaraw.ph",
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  return (
    <>
      {/* Desktop View - Always visible on right side */}
    <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-[9997]">
  <div className="flex flex-col space-y-4">
    {socialLinks.map((social, index) => {
      const IconComponent = social.icon
      return (
        <Button
          key={social.name}
          asChild
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${social.color}`}
          title={social.name}
        >
          <a href={social.url} target="_blank" rel="noopener noreferrer">
            <IconComponent className="w-6 h-6 text-white" />
          </a>
        </Button>
      )
    })}
  </div>
</div>


      {/* Mobile View - Expandable menu */}
     {/* Mobile View - Expandable menu */}
<div className="lg:hidden fixed right-6 top-1/2 transform -translate-y-1/2 z-[9997]">
  <div className="flex flex-col items-center space-y-4">
    {/* Expandable social icons */}
    <div
      className={`flex flex-col space-y-4 transition-all duration-300 ${
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {socialLinks.map((social, index) => {
        const IconComponent = social.icon
        return (
          <Button
            key={social.name}
            asChild
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${social.color}`}
            style={{ transitionDelay: `${index * 50}ms` }}
            title={social.name}
          >
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              <IconComponent className="w-6 h-6 text-white" />
            </a>
          </Button>
        )
      })}
    </div>

    {/* Toggle button */}
    <Button
      onClick={() => setIsExpanded(!isExpanded)}
      className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${
        isExpanded
          ? "bg-red-500 hover:bg-red-600 rotate-45"
          : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      }`}
      aria-label={isExpanded ? "Close social menu" : "Open social menu"}
    >
      <Share2 className="w-6 h-6 text-white" />
    </Button>
  </div>
</div>

    </>
  )
}
