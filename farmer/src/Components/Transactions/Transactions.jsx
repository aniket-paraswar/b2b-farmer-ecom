import React, { useEffect, useState } from 'react';
import './Transactions.css';

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        try {
            const response = await fetch('https://fbackend-zhrj.onrender.com/farmer/transactions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('x-access-token'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    setTransactions(data.transactions);
                } else {
                    setError('Failed to fetch transactions');
                }
            } else {
                const errorText = await response.text();
                console.error('Error fetching transactions:', errorText);
                setError('Failed to fetch transactions');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div>
            <h1>Your Transactions</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Buyer Name</th>
                            <th>Buyer Phone</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                transaction.product.map((product) => (
                                    <tr key={transaction._id + product._id}>
                                        <td>{transaction._id}</td>
                                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                        <td>₹ {transaction.totalBill}</td>
                                        <td>Accepted</td>
                                        <td>{transaction.to.name}</td> {/* Accessing buyer's name */}
                                        <td>{transaction.to.phone}</td> {/* Accessing buyer's phone */}
                                        <td>{product.name}</td> {/* Accessing product's name */}
                                        <td>{transaction.quantity}</td> {/* Accessing quantity */}
                                        <td>₹ {product.price}</td> {/* Accessing product's price */}
                                    </tr>
                                ))
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No transactions available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};
