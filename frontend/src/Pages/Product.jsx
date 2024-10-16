import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/Product.css'; // Import CSS for styling

export const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); // To store cart items

  useEffect(() => {
    // Fetch product details by ID
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fbackend-zhrj.onrender.com/product/${id}`);
        const data = await response.json();
        setProduct(data); // Assuming the API returns product details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    // Fetch cart items for the logged-in user
    const fetchCartItems = async () => {
      const token = localStorage.getItem('x-access-token'); // Get token from local storage

      if (token) {
        try {
          const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/cart', {
            headers: {
              'x-access-token': token, // Include token in headers
            },
          });

          const data = await response.json();
          setCartItems(data.cart || []); // Assuming the API returns cart items
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };

    fetchProductDetails();
    fetchCartItems();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('x-access-token');

    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    // Check if the product is already in the cart
    if (cartItems.includes(id)) {
      alert('Product already added to cart.');
      return;
    }

    try {
      const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await response.json();

      if (data.result) {
        alert('Product added to cart successfully.');
        // Update cart items state
        setCartItems([...cartItems, id]); // Add the new product ID to the cart items
      } else {
        alert(data.error || 'Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details">
      {/* Left side: Product Details */}
      <div className="product-details-left">
        <img src={`http://localhost:9813${product.image}`} alt={product.name} className="product-details-image" />
        <h1 className="product-details-name">{product.name}</h1>
        <p className="product-details-type"><strong>Type:</strong> {product.type}</p>
        <p className="product-details-expiry"><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
        <p className="product-details-quantity"><strong>Quantity:</strong> {product.quantity}</p>
        <p className="product-details-price"><strong>Price:</strong> ₹{product.price}</p>
        <p className="product-details-description"><strong>Description:</strong> {product.description}</p>
      </div>
  
      {/* Right side: Farmer Details and Add to Cart */}
      <div className="product-details-right">
        <div className="product-farmer-details">
          <h3>Farmer Details:</h3>
          <p><strong>Name:</strong> {product.farmer.name}</p>
          <p><strong>Phone:</strong> {product.farmer.phone}</p>
          <p><strong>State:</strong> {product.farmer.state}</p>
          <p><strong>District:</strong> {product.farmer.district}</p>
        </div>
        
        {/* Quantity Input and Add to Cart Button */}
        <div className="quantity-section">
          <input type="number" defaultValue={1} min={1} />
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
