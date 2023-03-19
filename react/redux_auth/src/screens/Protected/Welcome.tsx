import { Link } from "react-router-dom";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../../features/auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import Logout from "../../components/Logout";

const Welcome = () => {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  const welcome = user ? `Welcome ${user}!` : "Welcome!";
  const tokenAbbr = `${token ? `${(token as string).slice(0, 9)}...` : ""}`;

  const content = (
    <section className="welcome">
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>
      <p>
        <Link to="/userslist">Go to the Users List</Link>
      </p>
      <Logout>
        <button>logout</button>
      </Logout>
    </section>
  );

  return content;
};
export default Welcome;
