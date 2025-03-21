import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [], // Load from local storage
    totalQuantity: JSON.parse(localStorage.getItem("cartItems"))?.length || 0,
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("action.payload-", action.payload);
      state.items.push(action.payload);
      state.totalQuantity += 1;
      localStorage.setItem("cartItems", JSON.stringify(state.items)); // Save to local storage
      alert(`Item ${action.payload.productName} has been added to your cart`);
    },
    removeFromCart: (state, action) => {
      // console.log("action.payload-", action.payload);
      // state.items = state.items.filter(item => item.productId !== action.payload); // remove items and save to localstorage

      const { index, id } = action.payload;

      // Find the actual index of the item to remove in case cart is re-ordered
      const actualIndex = state.items.findIndex((item, i) => i === index && item.productId === id);

      if (actualIndex !== -1) {
        state.items.splice(actualIndex, 1); // Remove the exact instance
      }
      state.totalQuantity = state.items.length;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];  // clear all items and save to local storage
      state.totalQuantity = 0;
      localStorage.removeItem("cartItems");
    },
    loadCartFromStorage: (state) => {
      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      state.items = savedCart;
      state.totalQuantity = savedCart.length;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;


