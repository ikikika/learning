import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";
import { CartItemType } from "../../types/CartItemType";

const initialState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems &&
        state.cartItems.forEach((item: CartItemType) => {
          if (item) {
            amount += item.amount;
            total += item.amount * parseFloat(item.price);
          }
        });
      state.amount = amount;
      state.total = total;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    removeItem: (state, action) => {
      const itemId = action.payload;

      state.cartItems = state.cartItems.filter(
        (item: CartItemType) => item.id !== itemId
      );
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find(
        (item: CartItemType) => item.id === payload.id
      );
      if (typeof cartItem != "undefined") {
        cartItem["amount"]++;
      }
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find(
        (item: CartItemType) => item.id === payload.id
      );
      if (typeof cartItem != "undefined") {
        cartItem["amount"]--;
      }
    },
  },
});

export const { calculateTotals, clearCart, removeItem, increase, decrease } =
  cartSlice.actions;
export default cartSlice.reducer;
