import axios from 'axios';

// Base URL for Drupal backend
const API_BASE_URL = import.meta.env.VITE_DRUPAL_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/jsonapi`,
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Menu Service
export const menuService = {
  getMainMenu: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/menu_items/main`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching main menu:', error);
      throw error;
    }
  }
};

// Content Service
export const contentService = {
  getBanners: async () => {
    try {
      const response = await apiClient.get('/node/banner');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },
  
  getHomepageContent: async () => {
    try {
      const response = await apiClient.get('/node/page/home');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      throw error;
    }
  }
};

// Authentication
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login?_format=json`, {
        name: username,
        pass: password,
      });
      const { csrf_token, logout_token, current_user } = response.data;
      
      localStorage.setItem('authToken', csrf_token);
      localStorage.setItem('logoutToken', logout_token);
      localStorage.setItem('user', JSON.stringify(current_user));
      
      return current_user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const logoutToken = localStorage.getItem('logoutToken');
      await axios.post(`${API_BASE_URL}/user/logout?_format=json&token=${logoutToken}`);
      localStorage.removeItem('authToken');
      localStorage.removeItem('logoutToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register?_format=json`, {
        name: { value: username },
        mail: { value: email },
        pass: { value: password },
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Products
export const productService = {
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(`filter[${key}]`, value.toString());
      });
      
      const response = await apiClient.get(`/commerce_product/default?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getProductById: async (id: string) => {
    try {
      const response = await apiClient.get(`/commerce_product/default/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  getProductCategories: async () => {
    try {
      const response = await apiClient.get('/taxonomy_term/product_category');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
};

// Cart & Orders
export const orderService = {
  createOrder: async (orderData: any) => {
    try {
      const response = await apiClient.post('/commerce_order/default', {
        data: {
          type: 'commerce_order--default',
          attributes: { ...orderData }
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  getUserOrders: async () => {
    try {
      const response = await apiClient.get('/commerce_order/default');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  getOrderById: async (id: string) => {
    try {
      const response = await apiClient.get(`/commerce_order/default/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },
};

export default {
  auth: authService,
  products: productService,
  orders: orderService,
  menu: menuService,
  content: contentService
};