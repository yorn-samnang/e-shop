
// lib/api.ts
import axios from 'axios';
import { 
  RegisterData, 
  LoginCredentials, 
  ProductData, 
  CartItemData, 
  OrderCreateData 
} from './types'; // Make sure this path is correct

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor for adding the auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') { // Check if we're in a browser environment
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') { // Check if we're in a browser environment
        localStorage.removeItem('token');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData: RegisterData) => api.post('/auth/register/', userData),
  // Fixed: Added trailing slash to login endpoint
  login: (credentials: LoginCredentials) => api.post('/auth/login/', credentials),
  googleLogin: (credential: string) => api.post('/auth/google/', { credential }),
  // Added trailing slash to getProfile for consistency
  getProfile: () => api.get('/auth/me/'),
  updateProfile: (data: { username?: string; first_name?: string; last_name?: string; profile_image?: string }) =>
    api.patch('/auth/me/', data),
};

// Products endpoints
export const productsAPI = {
  getAll: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get('/products/', { params }),
  getById: (id: number) => api.get(`/products/${id}/`),
  create: (productData: ProductData) => api.post('/products/', productData),
  update: (id: number, productData: Partial<ProductData>) => api.put(`/products/${id}/`, productData),
  delete: (id: number) => api.delete(`/products/${id}/`),
};

// Cart endpoints - Fixed based on Django URL patterns
export const cartAPI = {
  getCart: () => api.get('/cart/'),  // This will become /api/cart/ with the baseURL
  addToCart: (cartItem: CartItemData) => api.post('/cart/', cartItem),
  updateCartItem: (productId: number, quantity: number) => api.put(`/cart/${productId}/`, { quantity }),
  removeFromCart: (productId: number) => api.delete(`/cart/${productId}/`),
};

// Orders endpoints
export const ordersAPI = {
  createOrder: (orderData: OrderCreateData) => api.post('/orders/', orderData),
  getOrders: () => api.get('/orders/'),
  getOrderById: (id: number) => api.get(`/orders/${id}/`),
};

// Banners endpoints
export const bannersAPI = {
  getAll: () => api.get('/banners/'),
};


export default api;
