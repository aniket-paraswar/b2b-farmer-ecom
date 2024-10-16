import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

export const ListProduct = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all products for the authenticated farmer
    const fetchInfo = async () => {
        try {
            const res = await fetch('https://fbackend-zhrj.onrender.com/farmer/products', {
                headers: {
                    'x-access-token': localStorage.getItem('x-access-token')  // Replace with actual auth token
                }
            });
            const data = await res.json();

            if (data.result) {
                setAllProducts(data.products); // Set the product list from the response
            } else {
                // setError(data.message || 'Failed to fetch products');
                setError(data.message || 'Failed to fetch products');

            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('An error occurred while fetching products');
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    // Remove product by sending a DELETE request with the product ID
    const removeProduct = async (productId) => {
        if (window.confirm("Are you sure you want to remove this product?")) {
            try {
                const response = await fetch('https://fbackend-zhrj.onrender.com/farmer/product/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('x-access-token')  // Replace with actual auth token
                    },
                    body: JSON.stringify({ productId })  // Send productId in the request body
                });

                const data = await response.json();
                if (data.result) {
                    alert(data.message);  // Show success message
                    await fetchInfo(); // Refresh the product list after removal
                } else {
                    alert('Failed to remove product: ' + data.message);
                }
            } catch (error) {
                console.error('Error removing product:', error);
                alert('An error occurred while removing the product');
            }
        }
    };

    return (
        <div className='list-product'>
            <h1>Your Product List</h1>
            <div className="listproduct-format-main">
                <p>Product</p>
                <p>Title</p>
                <p>Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {error ? (
                    <p>{error}</p>
                ) : allProducts.length > 0 ? (
                    allProducts.map((product) => (
                        <div key={product._id} className="listproduct-format-main listproduct-format">
                            <img src={`https://fbackend-zhrj.onrender.com${product.image}`} alt={product.name} className='listproduct-product-icon' />
                            <p>{product.name}</p>
                            <p>₹{product.price}</p>
                            <p>{product.type}</p>
                            <img
                                onClick={() => removeProduct(product._id)}
                                src={cross_icon}
                                alt="Remove"
                                className='listproduct-remove-icon'
                            />
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};
