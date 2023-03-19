import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../features/auth/authSlice";
import BackToLogin from "./BackToLogin";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);

  return token ? <Outlet /> : <BackToLogin />;
};
export default RequireAuth;
