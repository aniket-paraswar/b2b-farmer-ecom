const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['vegetables', 'fruits', 'grains'], required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },  // Reference to Farmer
}, { timestamps: true });

// Farmer Schema
const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Added password field
  state: { type: String, required: true },
  district: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // References to Products
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],  // References to Transactions
}, { timestamps: true });

// Buyer Schema
const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartproducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],  // References to Transactions
}, { timestamps: true });

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },  // Reference to Farmer
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },  // Reference to Buyer
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],  // Reference to Product
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalBill: { type: Number, required: true },
}, { timestamps: true });

// Models
const Product = mongoose.model('Product', productSchema);
const Farmer = mongoose.model('Farmer', farmerSchema);
const Buyer = mongoose.model('Buyer', buyerSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the models
module.exports = {
  Product,
  Farmer,
  Buyer,
  Transaction,
};
