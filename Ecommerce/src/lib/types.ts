// User and Authentication Types
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
    is_staff: boolean;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user?: User;
  }
  
  // Product Types
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    in_stock: number;
    category?: ProductCategory;
  }

export type ProductCategory = 'electronics' | 'clothing' | 'accessories' | 'home';
  
export interface ProductData {
    name: string;
    description: string;
    price: number;
    image_url?: string;
    stock: number;
    category?: ProductCategory;
  }
  
  // Cart Types
  export interface CartItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }
  
  export interface CartItemData {
    product_id: number;
    quantity: number;
  }
  
  // Order Types
  export interface OrderItem {
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }
  
  export interface Order {
    order_id: number;
    status: string;
    total: number;
    items: OrderItem[];
    created_at: string;
    address?: string;
  }
  
  export interface OrderSummary {
    order_id: number;
    status: string;
    total: number;
    created_at: string;
  }
  
  export interface OrderCreateData {
    address: string;
  }

// Banner Types
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  button_label?: string;
  button_link?: string;
  is_active: boolean;
  order: number;
}
