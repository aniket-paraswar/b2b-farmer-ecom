import React, { useState, useEffect } from 'react'; 
import './CSS/ShopCategory.css';
import dropdown_icon from '../../Components/Assets/dropdown_icon.png';
import { Item } from '../../Components/Item/Item';

export const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedState, setSelectedState] = useState('All States');
  const [loading, setLoading] = useState(true);

  const states = ['All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  useEffect(() => {
    // Fetching all products with farmer details from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fbackend-zhrj.onrender.com/products'); // Replace with the actual API endpoint
        const data = await response.json();
        setProducts(data);  // Assuming the data is an array of products
        setFilteredProducts(data); // Initially, show all products
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler for filtering products by state
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);

    if (state === 'All States') {
      setFilteredProducts(products); // Show all products if no specific state is selected
    } else {
      setFilteredProducts(products.filter(product => product.farmer.state === state));
    }
  };

  // If loading, show a loading spinner or message
  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing {filteredProducts.length}</span> products
        </p>
        <div className='shopcategory-sort'>
          Sort by State 
          <select value={selectedState} onChange={handleStateChange} className="state-dropdown">
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
          <img src={dropdown_icon} alt="dropdown icon" />
        </div>
      </div>

      {/* Display filtered products based on the selected category and state */}
      <div className='shopcategory-products'>
        {filteredProducts
          .filter((item) => item.type === props.category)  // Filter by category (e.g., 'vegetables', 'fruits', 'grains')
          .map((item, i) => (
            <Item
              key={i}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}  // Using 'price' instead of 'new_price'
              state={item.farmer.state}   // Assuming farmer details are populated
              district={item.farmer.district}
            />
          ))}
      </div>

      {/* Load more button */}
      <div className="shopcategory-loadmore">
        Explore more 
      </div>
    </div>
  );
};
