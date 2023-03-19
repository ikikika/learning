import { ReactNode } from "react";
import { useAppDispatch } from "../app/hooks";
import { logOut } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { logoutService } from "../features/auth/logoutService";

const Logout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickLogoutHandler = async () => {
    try {
      dispatch(logoutService.endpoints.logout.initiate(null));
      dispatch(logOut());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return <div onClick={onClickLogoutHandler}>{children}</div>;
};

export default Logout;
