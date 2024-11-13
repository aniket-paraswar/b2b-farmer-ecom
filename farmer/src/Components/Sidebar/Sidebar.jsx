import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../../assets/Product_Cart.svg';
import weather from '../../assets/weather.png';
import list_product_icon from '../../assets/Product_list_icon.svg';
import trans from '../../assets/trans.png';
import scrap from '../../assets/scrap.png';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={'/addproduct'} style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="Add product" style={{ width: '24px', height: '24px' }} />
          <p>Add product</p>
        </div>
      </Link>

      <Link to={'/listproduct'} style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="Product List" style={{ width: '24px', height: '24px' }} />
          <p>Product List</p>
        </div>
      </Link>

      <Link to={'/transaction'} style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={trans} alt="Transactions" style={{ width: '24px', height: '24px' }} />
          <p>Transactions</p>
        </div>
      </Link>

      <Link to={'/weather'} style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={weather} alt="Weather" style={{ width: '24px', height: '24px' }} />
          <p>Weather</p>
        </div>
      </Link>

      <Link to={'/scrapping'} style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={scrap} alt="Scrapping" style={{ width: '24px', height: '24px' }} />
          <p>Market Prices</p>
        </div>
      </Link>
    </div>
  );
};
