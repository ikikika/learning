import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { RootState } from "../redux/store";
import { useAppDispatch, useAppSelector } from "../hooks";
import { calculateTotals, clearCart } from "../features/cart/cartSlice";
import { CartItemType } from "../types/CartItemType";

const CartContainer = () => {
  const { cartItems, total, amount } = useAppSelector(
    (state: RootState) => state.cart
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch]);

  if (amount < 1) {
    return (
      <section className="cart">
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className="empty-cart">is currently empty</h4>
        </header>
      </section>
    );
  }
  return (
    <section className="cart">
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cartItems &&
          cartItems.map((item: CartItemType) => {
            return <CartItem key={item.id} {...item} />;
          })}
      </div>
      {/* cart footer */}
      <footer>
        <hr />
        <div className="cart-total">
          <h4>
            total <span>${total}</span>
          </h4>
        </div>
        <button
          className="btn clear-btn"
          onClick={() => {
            dispatch(clearCart());
          }}
        >
          clear cart
        </button>
      </footer>
    </section>
  );
};

export default CartContainer;
