// Import required packages
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection string (placeholder - replace with your actual MongoDB URL)
const MONGODB_URL = 'mongodb://localhost:27017/productDB';
// Alternative for MongoDB Atlas:
// const MONGODB_URL = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/productDB?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create Product Model
const Product = mongoose.model('Product', productSchema);

// ====================
// CRUD OPERATIONS ROUTES
// ====================

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Product CRUD API' });
});

// CREATE - Add a new product
// POST /api/products
app.post('/api/products', async (req, res) => {
  try {
    // Extract product data from request body
    const { name, price, category } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ 
        error: 'All fields (name, price, category) are required' 
      });
    }

    // Create new product using Product model
    const product = new Product({
      name,
      price,
      category
    });

    // Save to database
    const savedProduct = await product.save();

    // Return success response
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    }
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all products
// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    // Retrieve all products from database
    const products = await Product.find();

    // Return products array
    res.status(200).json({
      message: 'Products retrieved successfully',
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single product by ID
// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    // Find product by ID
    const product = await Product.findById(id);

    // Return 404 if product not found
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return product
    res.status(200).json({
      message: 'Product retrieved successfully',
      product: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a product by ID
// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    const { name, price, category } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    // Validate that at least one field is being updated
    if (!name && !price && !category) {
      return res.status(400).json({ 
        error: 'At least one field (name, price, or category) must be provided' 
      });
    }

    // Validate price if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    // Find product by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );

    // Return 404 if product not found
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return updated product
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete a product by ID
// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    // Find product by ID and delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Return 404 if product not found
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return success message
    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
