import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchUsers } from "../store";

function UsersList() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // step 6: dispatch the thunk
    dispatch(fetchUsers());
  }, [dispatch]);

  return <div>users list</div>;
}

export default UsersList;
