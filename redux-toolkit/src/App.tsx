import React, { useEffect } from "react";
import CartContainer from "./components/CartContainer";
import Navbar from "./components/Navbar";
import { calculateTotals } from "./features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

function App() {
  const { cartItems } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
    
  }, [dispatch, cartItems]);

  return (
    <>
      <Navbar />
      <CartContainer />
    </>
  );
}

export default App;
