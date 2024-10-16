import React, { useState } from 'react';
import './CartItems.css';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);  // Manage item quantity locally

  const handleRemove = async () => {
    onRemove(item._id);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    onQuantityChange(item._id, newQuantity);  // Send new quantity to parent component
  };

  return (
    <div className="cartitems">
      <div className="cartitem">
        <img src={`http://localhost:9813${item.image}`} alt={item.name} className="cartitem-image" />
        <div className="cartitem-details">
          <h3 className="cartitem-name">{item.name}</h3>
          <div className="cartitem-price">₹{item.price}</div>
          <div className="quantity">
            <span>Quantity:</span>
            <input
              type="number"
              value={quantity}
              min={1}
              className="quantity-input"
              onChange={handleQuantityChange}  // Handle quantity change
            />
          </div>
          <div className="cartitem-remove">
            <img
              src={remove_icon}
              alt="Remove"
              className="remove-icon"
              onClick={handleRemove}  // Call remove function on click
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
