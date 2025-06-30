export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "YAMAARAW - Electric Mobility Solutions",
  description: "Leading innovator in electric mobility solutions across Asia and beyond. Delivering smart, sustainable, and high-performance electric vehicles.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Service",
      href: "/service",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Orders",
      href: "/orders",
    },
    {
      label: "Wishlist",
      href: "/wishlist",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Warranty",
      href: "/warranty",
    },
    {
      label: "Service Centers",
      href: "/service",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & FAQ",
      href: "/faq",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  productCategories: [
    {
      label: "Electric Bicycles",
      href: "/products?category=Electric Bicycles",
    },
    {
      label: "Electric Tricycles", 
      href: "/products?category=Electric Tricycles",
    },
    {
      label: "Electric Motorcycles",
      href: "/products?category=Electric Motorcycles",
    },
    {
      label: "Solar-Powered Bicycles",
      href: "/products?category=Solar-Powered Bicycles",
    },
    {
      label: "Accessories",
      href: "/products?category=Accessories",
    },
  ],
  links: {
    facebook: "https://facebook.com/yamaaraw",
    instagram: "https://instagram.com/yamaaraw",
    twitter: "https://twitter.com/yamaaraw",
    youtube: "https://youtube.com/@yamaaraw",
    support: "mailto:support@yamaaraw.com",
    sales: "mailto:sales@yamaaraw.com",
    phone: "+63 (02) 123-4567",
    address: "Manila, Philippines",
  },
  company: {
    name: "Glory Bright International Energy Corp",
    established: "2025",
    mission: "To provide smart, sustainable, and powerful electric mobility solutions that improve lives and protect the environment.",
    vision: "To be a leading innovator in new energy transportation across Asia and beyond.",
    goals: "Deliver high-quality, reliable, and affordable electric vehicles",
  },
  features: {
    freeShipping: "Free shipping on orders over ₱50,000",
    warranty: "2-year comprehensive warranty",
    support: "24/7 customer support",
    serviceCenter: "Nationwide service centers",
    financing: "Flexible payment options available",
  },
}