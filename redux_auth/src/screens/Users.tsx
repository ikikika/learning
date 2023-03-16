import { Link } from "react-router-dom";

const UsersList = () => {
  const content = (
    <section className="users">
      <h1>Users List</h1>
      <Link to="/welcome">Back to Welcome</Link>
    </section>
  );

  return content;
};
export default UsersList;
