import { useAppSelector } from "../hooks";
import { CartIcon } from "../icons";
import { RootState } from "../redux/store";

const Navbar = () => {
  const { amount } = useAppSelector((state: RootState) => state.cart);

  return (
    <nav>
      <div className="nav-center">
        <h3>redux toolkit</h3>
        <div className="nav-container">
          <CartIcon />
          <div className="amount-container">
            <p className="total-amount">{amount}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
