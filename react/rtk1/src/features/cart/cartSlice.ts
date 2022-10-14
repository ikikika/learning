import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CartItemType } from "../../types/CartItemType";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

const url = "https://course-api.com/react-useReducer-cart-project";

export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
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
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        // console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { calculateTotals, clearCart, removeItem, increase, decrease } =
  cartSlice.actions;
export default cartSlice.reducer;
