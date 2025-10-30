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
    // TODO: Implement create product logic
    // Extract product data from request body
    // Create new product using Product model
    // Save to database and return response
    res.status(201).json({ message: 'Create product endpoint' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all products
// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    // TODO: Implement get all products logic
    // Retrieve all products from database
    // Return products array
    res.status(200).json({ message: 'Get all products endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single product by ID
// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    // TODO: Implement get product by ID logic
    // Extract ID from request parameters
    // Find product by ID
    // Return product or 404 if not found
    res.status(200).json({ message: 'Get product by ID endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a product by ID
// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  try {
    // TODO: Implement update product logic
    // Extract ID and updated data from request
    // Find product by ID and update
    // Return updated product or 404 if not found
    res.status(200).json({ message: 'Update product endpoint' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete a product by ID
// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    // TODO: Implement delete product logic
    // Extract ID from request parameters
    // Find product by ID and delete
    // Return success message or 404 if not found
    res.status(200).json({ message: 'Delete product endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
