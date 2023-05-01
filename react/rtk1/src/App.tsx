import React, { useEffect } from "react";
import CartContainer from "./components/CartContainer";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import { calculateTotals, getCartItems } from "./features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

function App() {
  const { cartItems, isLoading } = useAppSelector((state) => state.cart);
  const { isOpen } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='loading'>
        <h1>Loading...</h1>
      </div>
    );
  }


  return (
    <>
      {isOpen && <Modal />}
      <Navbar />
      <CartContainer />
    </>
  );
}

export default App;
