import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

export const Item = (props) => {
  return (
    <div className='item'>
      {/* Link to the product's page */}
      <Link to={`/product/${props.id}`}>
        <img onClick={() => window.scrollTo(0, 0)} src={`https://fbackend-zhrj.onrender.com${props.image}`} alt={props.name} />
      </Link>

      {/* Product name */}
      <p className="item-name">{props.name}</p>

      {/* Display product price */}
      <div className="item-prices">
        <div className="item-price">
          ₹{props.price}
        </div>
      </div>

      {/* Farmer details: State and District */}
      <div className="item-farmer-details">
        <p className="item-state">{props.state}</p>
        <p className="item-district">{props.district}</p>
      </div>
    </div>
  );
};
