import React, { useState, useEffect } from 'react';
import './CSS/Shop.css';
import { Item } from '../../Components/Item/Item';
import fruits_banner from '../../Components/Assets/banner_fruits.jpg'; // Add your fruit banner image path
import vegetables_banner from '../../Components/Assets/banner_vegetables.jpg'; // Add your vegetable banner image path
import grains_banner from '../../Components/Assets/banner_grains.jpg'; // Add your grain banner image path
import { Hero } from '../../Components/Hero/Hero';


export const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:9813/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('API Response:', data);
                setProducts(data); // Set the products array directly
            } else {
                const errorText = await response.text();
                console.error('Error fetching products:', errorText);
                setError('Failed to fetch products');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products by category
    const filterByCategory = (category) => {
        return products.filter((product) => product.type === category);
    };

    return (
        <div className="shop-container">
          <Hero/>
            <h1>New Products</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
                <>
                    {/* Fruits Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={fruits_banner} alt="Fruits" />
                            <h2>Fruits</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('fruits').length > 0 ? (
                                filterByCategory('fruits').map((product) => (
                                    <Item
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        image={product.image}
                                        price={product.price}
                                        state={product.farmer?.state}
                                        district={product.farmer?.district}
                                    />
                                ))
                            ) : (
                                <p>No fruits available</p>
                            )}
                        </div>
                    </div>

                    {/* Vegetables Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={vegetables_banner} alt="Vegetables" />
                            <h2>Vegetables</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('vegetables').length > 0 ? (
                                filterByCategory('vegetables').map((product) => (
                                    <Item
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        image={product.image}
                                        price={product.price}
                                        state={product.farmer?.state}
                                        district={product.farmer?.district}
                                    />
                                ))
                            ) : (
                                <p>No vegetables available</p>
                            )}
                        </div>
                    </div>

                    {/* Grains Section */}
                    <div className="category-section">
                        <div className="category-banner">
                            <img src={grains_banner} alt="Grains" />
                            <h2>Grains</h2>
                        </div>
                        <div className="product-slideshow">
                            {filterByCategory('grains').length > 0 ? (
                                filterByCategory('grains').map((product) => (
                                    <Item
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        image={product.image}
                                        price={product.price}
                                        state={product.farmer?.state}
                                        district={product.farmer?.district}
                                    />
                                ))
                            ) : (
                                <p>No grains available</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
