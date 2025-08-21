const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET /api/products - Get all products with optional filtering and pagination
router.get('/', getProducts);

// GET /api/products/:id - Get single product by ID
router.get('/:id', getProductById);

// POST /api/products - Add new product
router.post('/', addProduct);

// PUT /api/products/:id - Update existing product
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
