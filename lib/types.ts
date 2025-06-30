export interface ProductColor {
  name: string;
  code: string;  // 'code' is required here
  value: string;
  image: string;
}

export interface Specification {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  idealFor:string;
  name: string;
  model: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  category: string;
  sizes: string[];
  
  specifications: Specification[];  // Keep it as an array of objects
  colors: ProductColor[];  // Using ProductColor type for colors
  in_stock: boolean;
  featured:boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  color?: string;
  price: number;
  product: {
    id: string;
    name: string;
    model: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    colors: ProductColor[];  // Updated to match ProductColor
    category: string;
    specifications: Specification[];
    inStock: boolean;
    featured: boolean;
    idealFor: string[];
  };
  total: number;
}
