const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/productModel');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper function to read products from file
async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// Helper function to write products to file
async function writeProducts(products) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
}

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await readProducts();
    
    // Optional filtering by category
    const { category, limit, offset } = req.query;
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Pagination
    const startIndex = parseInt(offset) || 0;
    const limitNum = parseInt(limit) || filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limitNum);
    
    res.json({
      success: true,
      data: paginatedProducts,
      total: filteredProducts.length,
      offset: startIndex,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products'
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await readProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching product'
    });
  }
};

// Add new product
const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate product data
    const validationErrors = Product.validate(productData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Create new product
    const newProduct = new Product(
      Product.generateId(),
      productData.name.trim(),
      productData.description.trim(),
      parseFloat(productData.price),
      productData.category.trim(),
      productData.imageUrl.trim()
    );
    
    // Read existing products and add new one
    const products = await readProducts();
    products.push(newProduct);
    
    // Write back to file
    const writeSuccess = await writeProducts(products);
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save product'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding product'
    });
  }
};

// Update existing product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate update data
    const validationErrors = Product.validate(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Read products and find the one to update
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update the product
    const existingProduct = products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      name: updateData.name.trim(),
      description: updateData.description.trim(),
      price: parseFloat(updateData.price),
      category: updateData.category.trim(),
      imageUrl: updateData.imageUrl.trim(),
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    
    // Write back to file
    const writeSuccess = await writeProducts(products);
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating product'
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Read products and find the one to delete
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Remove the product
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    // Write back to file
    const writeSuccess = await writeProducts(products);
    if (!writeSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting product'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
