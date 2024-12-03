// services/apiServices.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Set the Authorization header
const setAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

//
// Public Functions
//

// Public product-related functions
export const getProducts = async () => axios.get(`${API_URL}/products`);

// Public order-related functions
export const createOrder = async (orderData) =>
  axios.post(`${API_URL}/orders`, orderData);

// Authentication functions for admin and partner
export const loginAdmin = async (username, password) =>
  axios.post(`${API_URL}/auth/login`, { username, password });

export const registerAdmin = async (username, password) =>
  axios.post(`${API_URL}/auth/register-admin`, { username, password });

export const registerPartner = async (partnerData) =>
  axios.post(`${API_URL}/auth/register-partner`, partnerData);

export const loginPartner = async (username, password) =>
  axios.post(`${API_URL}/auth/login-partner`, { username, password });

//
// Partner Functions
//

export const setAuthHeaderMultipart = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

// Get partner's own products
export const getPartnerProducts = async (token) =>
  axios.get(`${API_URL}/partner/products`, setAuthHeader(token));

// Create a product as a partner
export const createPartnerProduct = async (productData, token) =>
  axios.post(`${API_URL}/partner/products`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
        },
  });

// Update a product as a partner
export const updatePartnerProduct = async (id, productData, token) =>
  axios.put(`${API_URL}/partner/products/${id}`, productData, setAuthHeader(token));

// Get a product by ID as a partner
export const getPartnerProductById = async (id, token) =>
  axios.get(`${API_URL}/partner/products/${id}`, setAuthHeader(token));

// Delete a product as a partner
export const deletePartnerProduct = async (id, token) =>
  axios.delete(`${API_URL}/partner/products/${id}`, setAuthHeader(token));

// Get partner's own orders
export const getPartnerOrders = async (token) =>
  axios.get(`${API_URL}/partner/orders`, setAuthHeader(token));

// Update the status of an order as a partner
export const updatePartnerOrderStatus = async (id, status, token) =>
  axios.put(
    `${API_URL}/partner/orders/${id}`,
    { status },
    setAuthHeader(token)
  );

// Delete an order as a partner
export const deletePartnerOrder = async (id, token) =>
  axios.delete(`${API_URL}/partner/orders/${id}`, setAuthHeader(token));

//
// Admin Functions
//

// Get all products as admin
export const getAllProductsAdmin = async (token) =>
  axios.get(`${API_URL}/admin/products`, setAuthHeader(token));

// Get a product by ID as admin
export const getProductByIdAdmin = async (id, token) =>
  axios.get(`${API_URL}/admin/products/${id}`, setAuthHeader(token));

// Create a product as admin
export const createProductAdmin = async (productData, token) =>
  axios.post(`${API_URL}/admin/products`, productData, setAuthHeader(token));

// Update a product as admin
export const updateProductAdmin = async (id, productData, token) =>
  axios.put(`${API_URL}/admin/products/${id}`, productData, setAuthHeader(token));

// Delete a product as admin
export const deleteProductAdmin = async (id, token) =>
  axios.delete(`${API_URL}/admin/products/${id}`, setAuthHeader(token));

// Get all orders as admin
export const getAllOrdersAdmin = async (token) =>
  axios.get(`${API_URL}/admin/orders`, setAuthHeader(token));

// Get an order by ID as admin
export const getOrderByIdAdmin = async (id, token) =>
  axios.get(`${API_URL}/admin/orders/${id}`, setAuthHeader(token));

// Update the status of an order as admin
export const updateOrderStatusAdmin = async (id, status, token) =>
  axios.put(`${API_URL}/admin/orders/${id}`, { status }, setAuthHeader(token));

// Delete an order as admin
export const deleteOrderAdmin = async (id, token) =>
  axios.delete(`${API_URL}/admin/orders/${id}`, setAuthHeader(token));

// Get all partners as admin
export const getAllPartners = async (token) =>
  axios.get(`${API_URL}/admin/partners`, setAuthHeader(token));