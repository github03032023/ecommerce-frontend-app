// src/pages/OrderConfirmation.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { orderId, amount, name } = location.state || {};

    if (!orderId) {
        return (
            <div className="container mt-5 text-center">
                <h2>No order found.</h2>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-success text-center mb-4">Order Confirmed!</h2>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Amount Paid:</strong> ${amount}</p>
                <p className="mt-4 text-center">Thank you for your purchase!</p>
                <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={() => navigate("/")}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
