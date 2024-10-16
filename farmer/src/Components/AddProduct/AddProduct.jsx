import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

export const AddProduct = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        type: "vegetables", // Assuming default product type
        expiryDate: "",
        quantity: "",
        price: "",
        description: "",
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [message, setMessage] = useState(null); // Success/Error message
    const [error, setError] = useState(null); // Error message

    const imageHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        setLoading(true);  // Show loading screen
        setError(null);    // Clear previous error
        setMessage(null);  // Clear previous success message

        let formData = new FormData();
        formData.append('name', productDetails.name);
        formData.append('type', productDetails.type);
        formData.append('expiryDate', productDetails.expiryDate);
        formData.append('quantity', productDetails.quantity);
        formData.append('price', productDetails.price);
        formData.append('description', productDetails.description);
        formData.append('image', image);  // Image file to be uploaded

        try {
            const response = await fetch('http://localhost:9813/farmer/product', {
                method: 'POST',
                headers: {
                    'x-access-token': localStorage.getItem('x-access-token')   // Replace with actual auth token
                },
                body: formData,  // Send formData which includes the image
            });

            const data = await response.json();
            setLoading(false); // Hide loading screen

            if (data.result) {
                setMessage('Product added successfully');
                setTimeout(() => {
                    navigate('/listproduct'); // Redirect to list product page after 2 seconds
                }, 2000);
            } else {
                setError(data.error || 'Failed to add product');
            }
        } catch (error) {
            setLoading(false);  // Hide loading screen
            setError('An error occurred: ' + error.message);
        }
    };

    return (
        <div className='addproduct'>
            {/* Loading screen overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            )}

            <div className="addproduct-itemfield">
                <p>Product Name</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            <div className="addproduct-itemfield">
                <p>Type</p>
                <select
                    value={productDetails.type}
                    onChange={changeHandler}
                    name="type"
                    className='add-product-selector'
                    disabled={loading} // Disable interaction during loading
                >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                </select>
            </div>

            <div className="addproduct-itemfield">
                <p>Expiry Date</p>
                <input
                    value={productDetails.expiryDate}
                    onChange={changeHandler}
                    type="date"
                    name="expiryDate"
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            <div className="addproduct-itemfield">
                <p>Quantity</p>
                <input
                    value={productDetails.quantity}
                    onChange={changeHandler}
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            <div className="addproduct-itemfield">
                <p>Price</p>
                <input
                    value={productDetails.price}
                    onChange={changeHandler}
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            <div className="addproduct-itemfield">
                <p>Description</p>
                <textarea
                    value={productDetails.description}
                    onChange={changeHandler}
                    name="description"
                    placeholder="Enter product description"
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className='addproduct-thumbnail-img'
                        alt="Product thumbnail"
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="image"
                    id="file-input"
                    hidden
                    disabled={loading} // Disable interaction during loading
                />
            </div>

            {/* Error or Success message display */}
            {error && <div className='error-message'>{error}</div>}
            {message && <div className='success-message'>{message}</div>}

            <button onClick={Add_Product} className='addproduct-btn' disabled={loading}>
                {loading ? 'Adding...' : 'ADD PRODUCT'}
            </button>
        </div>
    );
};
