import { Link } from "react-router-dom";

const Welcome = () => {
  const welcome = "Welcome!";
  const tokenAbbr = `Token`;

  const content = (
    <section className="welcome">
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>
      <p>
        <Link to="/userslist">Go to the Users List</Link>
      </p>
    </section>
  );

  return content;
};
export default Welcome;
