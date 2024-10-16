import React, { useEffect, useState } from 'react';
import './Transaction.css';

export const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/transactions', {
                    method: 'POST',
                    headers: {
                        'x-access-token': localStorage.getItem('x-access-token'), // Include token in the request header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data = await response.json();
                if (data.result) {
                    setTransactions(data.transactions); // Assuming the response has transactions
                } else {
                    setError(data.error || 'Error fetching transactions');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Fetch transactions if user is logged in
        if (localStorage.getItem('x-access-token')) {
            fetchTransactions();
        } else {
            setLoading(false); // No need to load if not logged in
        }
    }, []);

    if (loading) {
        return <div>Loading transactions...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="transaction">
            <h1>Your Transactions</h1>
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction._id}</td>
                                <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Invalid Date'}</td>
                                <td>₹{transaction.totalBill}</td>
                                <td>{transaction.status || 'Placed'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
