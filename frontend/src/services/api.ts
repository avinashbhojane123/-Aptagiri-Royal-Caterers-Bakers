import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cake_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthenticated Requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cake_token');
      localStorage.removeItem('cake_user');
      // Optionally redirect to login, but let Context handle state change
    }
    return Promise.reject(error);
  }
);

// Modular API handlers
export const authApi = {
  register: (data: any) => api.post('/auth/register', data).then((res) => res.data),
  login: (data: any) => api.post('/auth/login', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data),
  forgotPassword: (data: { emailOrPhone: string; method: 'whatsapp' | 'email' }) =>
    api.post('/auth/forgot-password', data).then((res) => res.data),
  resetPassword: (data: { emailOrPhone: string; otp: string; newPassword?: string }) =>
    api.post('/auth/reset-password', data).then((res) => res.data),
};

export const cakeApi = {
  getCakes: (params?: { search?: string; flavor?: string; page?: number; limit?: number }) =>
    api.get('/cakes', { params }).then((res) => res.data),
  getCakeById: (id: string) => api.get(`/cakes/${id}`).then((res) => res.data),
  createCake: (data: any) => api.post('/cakes', data).then((res) => res.data),
  updateCake: (id: string, data: any) => api.put(`/cakes/${id}`, data).then((res) => res.data),
  deleteCake: (id: string) => api.delete(`/cakes/${id}`).then((res) => res.data),
};

export const orderApi = {
  createOrder: (data: { orderItems: { cakeId: string; quantity: number }[]; deliveryAddress: string }) =>
    api.post('/orders', data).then((res) => res.data),
  getMyOrders: () => api.get('/orders/my-orders').then((res) => res.data),
  getAllOrders: () => api.get('/orders').then((res) => res.data),
  getOrderById: (id: string) => api.get(`/orders/${id}`).then((res) => res.data),
  updateOrderStatus: (id: string, status: string, otp?: string) => api.put(`/orders/${id}/status`, { status, otp }).then((res) => res.data),
  confirmOrder: (id: string, otp: string) => api.post(`/orders/${id}/confirm`, { otp }).then((res) => res.data),
};

export const paymentApi = {
  createOrder: (orderId: string) =>
    api.post('/payments/create-order', { orderId }).then((res) => res.data),
  processPayment: (data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => api.post('/payments/process', data).then((res) => res.data),
};

export const analyticsApi = {
  getTopSelling: () => api.get('/analytics/top-selling').then((res) => res.data),
  getStats: () => api.get('/analytics/stats').then((res) => res.data),
  getTopCaterersSelling: () => api.get('/analytics/caterers-top-selling').then((res) => res.data),
};

export const caterersApi = {
  getCaterersMenu: () => api.get('/caterers/menu').then((res) => res.data),
  createCatererItem: (data: any) => api.post('/caterers/menu', data).then((res) => res.data),
  updateCatererItem: (id: string, data: any) => api.put(`/caterers/menu/${id}`, data).then((res) => res.data),
  deleteCatererItem: (id: string) => api.delete(`/caterers/menu/${id}`).then((res) => res.data),
};

export const whatsappApi = {
  getStatus: () => api.get('/whatsapp/status').then((res) => res.data),
  sendTestMessage: (data: { to: string; message: string }) => api.post('/whatsapp/test', data).then((res) => res.data),
  restartSession: () => api.post('/whatsapp/restart').then((res) => res.data),
};
