import React from 'react'
import './Admin.css'
import { Sidebar } from '../../Components/Sidebar/Sidebar'
import {Routes,Route} from 'react-router-dom'
import { AddProduct } from '../../Components/AddProduct/AddProduct'
import { ListProduct } from '../../Components/ListProduct/ListProduct'
import { Transactions } from '../../Components/Transactions/Transactions'
import { Weather } from '../../Components/Weather/Weather'
import { Scrapping } from '../../Components/Scrapping/Scrapping'

export const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
            <Route path='addproduct' element={<AddProduct/>}/>
            <Route path='listproduct' element={<ListProduct/>}/>
            <Route path='transaction' element={<Transactions/>}/>
            <Route path='weather' element={<Weather/>}/>
            <Route path='scrapping' element={<Scrapping/>}/>

        </Routes>
    </div>
  )
}
