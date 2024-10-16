import React, { useEffect, useState } from 'react';
import CartItems from '../../Components/CartItems/CartItems';
import './CSS/Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);  // State for processing order

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:9813/buyers/cart', {
                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('x-access-token'),
                    },
                });
                const data = await response.json();
                if (data.result) {
                    const updatedCart = data.cart.map(item => ({
                        ...item,
                        quantity: item.quantity || 1,  // Set default quantity to 1 if not provided
                    }));
                    setCartItems(updatedCart);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('x-access-token')) {
            fetchCartItems();
        }
    }, []);

    const handleRemoveItem = async (productId) => {
        try {
            const response = await fetch(`http://localhost:9813/buyers/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': localStorage.getItem('x-access-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (data.result) {
                setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setProcessing(true);  // Set processing state to true

        try {
            // Prepare the list of products and their quantities for the transaction
            const products = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity || 1,  // Ensure quantity is sent
            }));

            const response = await fetch('http://localhost:9813/buyers/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('x-access-token'),
                },
                body: JSON.stringify({ products }),  // Send product details
            });

            const data = await response.json();
            if (data.result) {
                alert(`Transaction completed successfully! Total Bill: ₹${data.totalBill}`);
                
                // Remove all items from cart after successful transaction
                setCartItems([]);
            } else {
                console.error(data.error);
                alert('Transaction failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
        } finally {
            setProcessing(false);  // Set processing state to false
        }
    };

    if (loading) {
        return <div>Loading cart items...</div>;
    }

    return (
        <div className='cart'>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <CartItems
                            key={item._id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onQuantityChange={handleQuantityChange}
                        />
                    ))}
                    <div className="checkout">
                        <button onClick={handleCheckout} disabled={processing}>
                            {processing ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
