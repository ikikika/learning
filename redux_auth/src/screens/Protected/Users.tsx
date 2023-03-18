import Logout from "../../components/Logout";
import { useGetUsersQuery } from "../../features/services/userService";
import { Link } from "react-router-dom";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(null);

  let content = <>whats going on</>;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <section className="users">
        <h1>Users List</h1>
        <ul>
          {users.map((user: any) => {
            return <li key={user.username}>{user.username}</li>;
          })}
        </ul>
        <Link to="/welcome">Back to Welcome</Link>
        <Logout>
          <button>logout</button>
        </Logout>
      </section>
    );
  } else if (isError) {
    content = (
      <p>
        Error:{JSON.stringify(error)} <Link to="/welcome">Back to Welcome</Link>
      </p>
    );
  }

  return content;
};
export default UsersList;
