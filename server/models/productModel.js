class Product {
  constructor(id, name, description, price, category, imageUrl) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageUrl = imageUrl;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Validate product data
  static validate(productData) {
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

    const validCategories = ['READY TO WEAR', 'NEW COLLECTION', 'SHOES'];
    if (productData.category && !validCategories.includes(productData.category)) {
      errors.push('Invalid category. Must be one of: ' + validCategories.join(', '));
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
  }

  // Generate unique ID
  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Update product data
  update(updateData) {
    if (updateData.name !== undefined) this.name = updateData.name;
    if (updateData.description !== undefined) this.description = updateData.description;
    if (updateData.price !== undefined) this.price = updateData.price;
    if (updateData.category !== undefined) this.category = updateData.category;
    if (updateData.imageUrl !== undefined) this.imageUrl = updateData.imageUrl;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Product;
