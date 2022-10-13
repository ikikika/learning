import React, { useEffect } from "react";
import CartContainer from "./components/CartContainer";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import { calculateTotals } from "./features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

function App() {
  const { cartItems } = useAppSelector((state) => state.cart);
  const { isOpen } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  return (
    <>
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </>
  );
}

export default App;
