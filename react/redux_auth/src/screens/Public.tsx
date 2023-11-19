import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>Public page</h1>
      </header>
      <footer>
        <Link to="/login">Login page</Link>
      </footer>
    </section>
  );
  return content;
};
export default Public;
