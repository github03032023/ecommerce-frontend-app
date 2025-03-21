import './App.css';
import AuthRoute from "./components/AuthRoute";
import Login from './components/Login';
import Unauthorized from './components/Unauthorized';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCartFromStorage } from '../src/slices/cartSlice';
import { useEffect, useState } from "react";
import ProductsDBData from './components/ProductsDBData';
import Cart from './components/Cart';
import Payment from './components/Payment';
import Register from './components/Register';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderConfirmation from "./components/OrderConfirmation";
//Publishable Stripe Key
const stripePromise = loadStripe("pk_test_51R4zWDHQ0Inu2WWrgWUYAbKrFrQQm0GCL4WmMQH0XA4RzriWnsQbN5MnsjQTMnT4RYI1H6IdHtIuAWAUMk7gtjrd00DKM65wVY");
function App() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCartFromStorage()); // Load cart from local storage on startup
  }, [dispatch]);
  const [searchQuery, setSearchQuery] = useState("");


  return (
    
    <Router>
      <Header setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<ProductsDBData searchQuery={searchQuery} />} />
        <Route path="/cart" element={<Cart />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes for Admin. Admin Panel only available for ADmin */}
        <Route element={<AuthRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminPanel />} />

        </Route>

        {/* Protected Routes for User */}
        <Route element={<AuthRoute allowedRoles={['user', 'admin']} />}>
          {/* Wrap Payment Route with Stripe Elements */}
          <Route
            path="/payment"
            element={
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            }
          />
        </Route>
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>

  );
}

export default App;
