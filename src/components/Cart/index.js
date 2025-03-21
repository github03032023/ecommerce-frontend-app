import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Calculate total price whenever cartItems change
    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(total);
    }, [cartItems]);


    // Function to handle proceeding to payment
    const proceedToPay = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            // Proceed to payment process
            navigate("/payment");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <div>
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <>
                    <div className="row">
                        {cartItems.map((item, index) => (
                            <div key={index} className="col-12 col-sm-12 col-md-12 col-lg-12 mb-3">
                                <div className="card h-100 d-flex flex-column align-items-center text-center p-3">
                                    <img src={item.image} className="card-img-top img-fluid" alt={item.productName} style={{ maxWidth: "100px" }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.productName}</h5>
                                        <p className="card-text fw-bold">$.{item.price}</p>
                                        <p className="card-text text-muted">{item.category}</p>
                                    </div>
                        
                                    <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart({index, id: item.productId }))}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-3">
                        <h5 className="m-0">Total Items: <span className="badge bg-primary">{cartItems.length}</span></h5>
                        <h5 className="m-0">Total Price: <span className="fw-bold">${totalPrice.toFixed(2)}</span></h5>
                    </div>

                    <button className="btn btn-success mt-3" onClick={proceedToPay}>
                        Proceed To Pay
                    </button>

                </>
            )}

            {cartItems.length > 0 && (
                <button className="btn btn-warning mt-3" onClick={() => dispatch(clearCart())}>
                    Clear Cart
                </button>
            )}
        </div>
    );
};

export default Cart;
