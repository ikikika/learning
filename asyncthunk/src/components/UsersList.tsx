import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addUser, fetchUsers } from "../store";
import Skeleton from "./Skeleton";
import Button from "./Button";

function UsersList() {
  const dispatch = useAppDispatch();

  const { isLoading, data, error } = useAppSelector((state) => {
    return state.users;
  });

  useEffect(() => {
    // step 6: dispatch the thunk
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserAdd = () => {
    console.log("hahah");
    dispatch(addUser());
  };

  if (isLoading) {
    return <Skeleton times={6} className="h-10 w-full" />;
  }

  if (error) {
    return <div>Error fetching data...</div>;
  }

  const renderedUsers = data.map((user) => {
    return (
      <div key={user.id} className="mb-2 border rounded">
        <div className="flex p-2 justify-between items-center cursor-pointer">
          {user.name}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="flex flex-row justify-between items-center m-3">
        <h1 className="m-2 text-xl">Users</h1>
        <Button onClick={handleUserAdd}>+ Add User</Button>
      </div>
      {renderedUsers}
    </div>
  );
}

export default UsersList;
