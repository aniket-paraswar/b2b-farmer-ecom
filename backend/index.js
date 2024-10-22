
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Product, Farmer, Buyer, Transaction } = require('./db');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const backendUrl = "https://fbackend-zhrj.onrender.com"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Images will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);  // Dynamic filename to avoid overwriting
    }
});
const upload = multer({ storage: storage });

// Serve the 'uploads' directory as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/ping', (req, res) => {
    res.send('Server is alive and well');
  });
  
  // Another route, for example purposes
  app.get('/status', (req, res) => {
    res.json({ status: 'Server is running fine' });
  });
  
  // Function to make self-calls
  function callSelfRoutes() {
    // Call your own /ping route
    axios.get(`${backendUrl}/ping`)
      .then(response => {
        console.log('Ping successful:', response.data);
      })
      .catch(error => {
        console.error('Error during /ping:', error.message);
      });
  
    // Call your own /status route
    axios.get(`${backendUrl}/status`)
      .then(response => {
        console.log('Status check:', response.data);
      })
      .catch(error => {
        console.error('Error during /status:', error.message);
      });
  }
  
  // Set up interval to call itself every 14 minutes (840000 ms)
setInterval(callSelfRoutes, 340000);
// --------- Buyer Sign Up ---------
app.post('/buyers/signup', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const newBuyer = new Buyer({ name, phone, password });
        await newBuyer.save();
        res.status(201).json({ result: true, message: 'Buyer registered successfully' });
    } catch (error) {
        res.status(400).json({ result: false, error: error.message });
    }
});

// --------- Buyer Sign In ---------
app.post('/buyers/signin', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const buyer = await Buyer.findOne({ phone });

        if (!buyer) return res.status(404).json({ result: false, error: 'Buyer not found' });

        // Simple password comparison
        if (buyer.password !== password) {
            return res.status(400).json({ result: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: buyer._id, role: 'buyer' }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ result: true, token });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

// --------- Farmer Sign Up ---------
app.post('/farmers/signup', async (req, res) => {
    try {
        const { name, phone, state, district, password } = req.body;
        const newFarmer = new Farmer({ name, phone, state, district, password });
        await newFarmer.save();
        res.status(201).json({ result: true, message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(400).json({ result: false, error: error.message });
    }
});

// --------- Farmer Sign In ---------
app.post('/farmers/signin', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const farmer = await Farmer.findOne({ phone });

        if (!farmer) return res.status(404).json({ result: false, error: 'Farmer not found' });

        // Simple password comparison
        if (farmer.password !== password) {
            return res.status(400).json({ result: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: farmer._id, role: 'farmer' }, process.env.JWT_SECRET, {
            expiresIn: '23h',
        });

        res.json({ result: true, token });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

const verifyFarmerToken = (req, res, next) => {
    // Get the token from the custom header
    const token = req.headers['x-access-token']; // Custom header name

    if (!token) {
        return res.status(403).json({ result: false, error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ result: false, error: 'Unauthorized' });
        }

        // Save the farmer's ID from the token payload for use in the request
        req.userId = decoded.id; // Ensure that the payload includes the 'id'
        next(); // Proceed to the next middleware or route handler
    });
};


app.post('/farmer/product', verifyFarmerToken, upload.single('image'), async (req, res) => {
    const { name, type, expiryDate, quantity, price, description } = req.body;

    try {
        // Construct the image URL path
        const imageUrl = `/uploads/${req.file.filename}`;

        // Create new product object
        const newProduct = new Product({
            name,
            type,
            expiryDate,
            quantity,
            price,
            description,
            image: imageUrl,
            farmer: req.userId  // Assuming req.userId is set after authentication
        });

        // Save the product to the database
        await newProduct.save();

        // Respond with success message
        res.json({ result: true, message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

app.get('/farmer/products', verifyFarmerToken, async (req, res) => {
    try {
        // Fetch all products where the farmer is the authenticated user (req.userId)
        const products = await Product.find({ farmer: req.userId });

        if (products.length === 0) {
            return res.status(404).json({ result: false, message: 'No products found for this farmer' });
        }

        res.json({ result: true, products });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

app.get('/farmer/transactions', verifyFarmerToken, async (req, res) => {
    try {
        // Fetch transactions and populate buyer and product details
        const transactions = await Transaction.find({ from: req.userId })
            .populate({
                path: 'to', // Populate buyer details
                select: 'name phone' // Select only the fields we need
            })
            .populate({
                path: 'product', // Populate product details
                select: 'name price quantity' // Select only the fields we need
            });

        res.json({ result: true, transactions });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});






app.delete('/farmer/product/remove', verifyFarmerToken, async (req, res) => {
    const { productId } = req.body; // Get product ID from request body

    try {
        // Find the product by ID and check if it belongs to the authenticated farmer
        const product = await Product.findOne({ _id: productId, farmer: req.userId });

        if (!product) {
            return res.status(404).json({ result: false, message: 'Product not found or not authorized to remove' });
        }

        // Remove the product from the database
        await Product.deleteOne({ _id: productId });

        // Optionally, remove the product reference from the farmer's products array
        await Farmer.findByIdAndUpdate(req.userId, { $pull: { products: productId } });

        res.json({ result: true, message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('farmer', 'name phone state district')  // Populating farmer details (name, phone, state, district)
            .select('name type expiryDate quantity price description image'); // Selecting all product fields you need

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name phone state district') // Populating farmer details
            .select('name type expiryDate quantity price description image'); // Selecting product fields you need

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        // Check if buyer already exists
        const existingBuyer = await Buyer.findOne({ phone });
        if (existingBuyer) {
            return res.status(400).json({ result: false, error: 'Buyer already exists' });
        }

        const newBuyer = new Buyer({ name, phone, password});

        await newBuyer.save();
        res.status(201).json({ result: true, message: 'Buyer registered successfully' });
    } catch (error) {
        res.status(400).json({ result: false, error: error.message });
    }
});

// --------- Buyer Sign In ---------
app.post('/signin', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const buyer = await Buyer.findOne({ phone });

        if (!buyer) {
            return res.status(404).json({ result: false, error: 'Buyer not found' });
        }

        
        if (password!==buyer.password) {
            return res.status(400).json({ result: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: buyer._id}, process.env.JWT_SECRET, {
            expiresIn: '23h',
        });

        res.json({ result: true, token });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

// Middleware for verifying buyer token
const verifyBuyerToken = (req, res, next) => {
    // Get the token from the custom header
    const token = req.headers['x-access-token']; // Custom header name

    if (!token) {
        return res.status(403).json({ result: false, error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ result: false, error: 'Unauthorized' });
        }

        // Save the buyer's ID from the token payload for use in the request
        req.buyerId = decoded.id; // Update this line
         // Ensure that the payload includes the 'id'
        next(); // Proceed to the next middleware or route handler
    });
};

app.post('/buyers/cart/add', verifyBuyerToken, async (req, res) => {
    try {
        const { productId } = req.body; // Get productId from the request body
        const buyerId = req.buyerId; // Now we use req.buyerId

        // Find the buyer by ID and update their cart
        const buyer = await Buyer.findByIdAndUpdate(
            buyerId,
            { $addToSet: { cartproducts: productId } }, // Ensure this matches your Buyer schema
            { new: true } // Return the updated buyer document
        );

        if (!buyer) {
            return res.status(404).json({ result: false, error: 'Buyer not found' });
        }

        res.status(200).json({ result: true, message: 'Product added to cart successfully', cart: buyer.cartproducts });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
    
});

// Endpoint to get all cart items for a specific buyer
// Endpoint to get all cart items for a specific buyer
app.get('/buyers/cart', verifyBuyerToken, async (req, res) => {
    try {
        const buyerId = req.buyerId; // Get buyer ID from the verified token

        // Find the buyer by ID and populate the cart products
        const buyer = await Buyer.findById(buyerId)
            .populate({
                path: 'cartproducts',
                select: 'name type expiryDate quantity price description image', // Selecting product fields
                populate: {
                    path: 'farmer',
                    select: 'name phone state district' // Selecting farmer fields
                }
            })
            .select('cartproducts'); // Select only the cartproducts field

        if (!buyer) {
            return res.status(404).json({ result: false, error: 'Buyer not found' });
        }

        res.status(200).json({ result: true, cart: buyer.cartproducts });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});


app.delete('/buyers/cart/remove', verifyBuyerToken, async (req, res) => {
    try {
        const buyerId = req.buyerId; // Get buyer ID from the verified token
        const { productId } = req.body; // Get the product ID from the request body

        // Find the buyer by ID
        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({ result: false, error: 'Buyer not found' });
        }

        // Check if the product is in the cart
        if (!buyer.cartproducts.includes(productId)) {
            return res.status(400).json({ result: false, error: 'Product not found in cart' });
        }

        // Remove the product from the cart
        buyer.cartproducts = buyer.cartproducts.filter(item => item.toString() !== productId);
        await buyer.save(); // Save the updated buyer document

        res.status(200).json({ result: true, message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
});

app.post('/buyers/transaction', verifyBuyerToken, async (req, res) => {
    try {
      const buyerId = req.buyerId;  // Get the buyer ID from the verified token
      const { products } = req.body; // Get product list from request body, products should be [{ productId, quantity }]
  
      if (!products || products.length === 0) {
        return res.status(400).json({ result: false, error: 'No products provided' });
      }
  
      let totalBill = 0;
      const productDetails = [];
      const farmersInvolved = new Set();  // To keep track of all farmers involved in this transaction
  
      // Loop through the products to validate them and calculate the total bill
      for (const { productId, quantity } of products) {
        const product = await Product.findById(productId).populate('farmer'); // Populate farmer details
  
        if (!product) {
          return res.status(404).json({ result: false, error: `Product with ID ${productId} not found` });
        }
  
        // Check if the requested quantity is available
        if (product.quantity < quantity) {
          return res.status(400).json({ result: false, error: `Insufficient quantity for product ${product.name}` });
        }
  
        // Calculate the total price for this product
        const productPrice = product.price * quantity;
        totalBill += productPrice;
  
        // Add farmer to the set of farmers involved in this transaction
        farmersInvolved.add(product.farmer._id.toString());
  
        // Store product details
        productDetails.push({
          productId: product._id,
          farmerId: product.farmer._id,
          quantity: quantity,
          price: product.price
        });
  
        // Update the quantity of the product in the database
        product.quantity -= quantity;
        await product.save();
      }
  
      // If there are multiple farmers, handle accordingly (for simplicity, assuming one farmer per transaction here)
      if (farmersInvolved.size > 1) {
        return res.status(400).json({ result: false, error: 'Multiple farmers in the same transaction are not supported yet' });
      }
  
      // Create a new transaction record
      const transaction = new Transaction({
        from: Array.from(farmersInvolved)[0],  // Farmer ID
        to: buyerId,  // Buyer ID
        product: productDetails.map(p => p.productId),  // Array of product IDs
        price: totalBill,
        quantity: products.reduce((total, p) => total + p.quantity, 0),  // Total quantity of all products
        totalBill: totalBill,
      });
  
      await transaction.save();
  
      res.status(200).json({ result: true, message: 'Transaction completed successfully', totalBill });
    } catch (error) {
      res.status(500).json({ result: false, error: error.message });
    }
  });

// In your main route file or app.js

app.post('/buyers/transactions', verifyBuyerToken, async (req, res) => {
    try {
        const buyerId = req.buyerId;  // The buyer's ID is extracted from the verified token (assumed to be stored in req.userId)

        // Find all transactions where 'to' matches the buyer's ID
        const transactions = await Transaction.find({ to: buyerId })
            .populate('from', 'name')  // Populate farmer details (name)
            .populate('product', 'name price');  // Populate product details (name, price)

        // If transactions are found, return them
        if (transactions.length > 0) {
            return res.status(200).json({ result: true, transactions });
        } else {
            return res.status(404).json({ result: false, message: 'No transactions found' });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ result: false, error: 'Failed to fetch transactions' });
    }
});



// Export the app to be used in server.js
module.exports = app;

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
