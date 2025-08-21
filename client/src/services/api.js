const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Helper function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Fetch all products with optional filtering and pagination
export const fetchProducts = async (options = {}) => {
  try {
    const { category, limit, offset } = options;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Fetch single product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Update existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Product categories
export const PRODUCT_CATEGORIES = [
  'READY TO WEAR',
  'NEW COLLECTION',
  'SHOES'
];

// Validation helpers
export const validateProductData = (productData) => {
  const errors = [];

  if (!productData.name || productData.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!productData.description || productData.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
    errors.push('Valid price is required');
  }

  if (!productData.category || productData.category.trim().length === 0) {
    errors.push('Product category is required');
  }

  if (productData.category && !PRODUCT_CATEGORIES.includes(productData.category)) {
    errors.push('Invalid category. Must be one of: ' + PRODUCT_CATEGORIES.join(', '));
  }

  if (!productData.imageUrl || productData.imageUrl.trim().length === 0) {
    errors.push('Product image URL is required');
  }

  // Basic URL validation
  if (productData.imageUrl) {
    try {
      new URL(productData.imageUrl);
    } catch (e) {
      errors.push('Invalid image URL format');
    }
  }

  return errors;
};

// Format price for display
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Format date for display
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
