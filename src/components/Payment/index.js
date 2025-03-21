import React, { useState } from "react";
import axios from "axios";
// import axios from '../../api/axiosSetup'
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Payment = () => {
    const [amount, setAmount] = useState(100);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [name, setName] = useState("");

    const stripe = useStripe();
    const elements = useElements();

    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };


    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const productIds = cartItems.map(item => item.productId);

        const userId = localStorage.getItem("userId");
        console.log("userId-", userId);
        console.log("productIds-", productIds);
        console.log("cartItems-", cartItems);
        // const userId = userInfo?._id;




        if (!stripe || !elements) {
            setError("Stripe is not loaded");
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // Create Payment Method from card details
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    name: name, // Pass name here
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                return;
            }
            // Send paymentMethod.id to backend
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/auth/payment',
                {
                    userId: userId,
                    name,
                    products: productIds,
                    amount,
                    paymentMethodId: paymentMethod.id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );


            const data = response.data;
            console.log("Data-", data)
            if (!data.clientSecret) {
                setError("Payment could not be initiated. Missing client secret.");
                return;
            }


            const confirmResult = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmResult.error) {
                setError(confirmResult.error.message);
            } else if (confirmResult.paymentIntent.status === "succeeded") {
                setSuccessMessage("Payment successful!");
                localStorage.removeItem("cartItems");
                // Navigate to confirmation page with order details
                navigate("/order-confirmation", {
                    state: {
                        orderId: data.orderId,
                        amount,
                        name,
                    },
                });
            }
        } catch (err) {
            setError("Payment failed. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row vh-100 align-items-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Payment</h2>

                        {error && <p className="alert alert-danger">{error}</p>}
                        {successMessage && <p className="alert alert-success">{successMessage}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Card Details</label>
                                <div className="mb-3">
                                    <label className="form-label">Name on Card</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <CardElement />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    className="form-control"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={!stripe}>
                                Pay Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
