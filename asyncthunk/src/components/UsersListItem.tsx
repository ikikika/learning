import { UserType } from "../types";
import { GoTrashcan } from "react-icons/go";
import Button from "./Button";
import { removeUser } from "../store";
import { useThunk } from "../hooks/useThunk";

function UsersListItem({ id, name }: UserType) {
  const [doRemoveUser, isLoading, error] = useThunk(removeUser);

  const handleClick = () => {
    if (typeof doRemoveUser === "function") {
      doRemoveUser({ id, name });
    }
  };

  return (
    <div className="mb-2 border rounded">
      <div className="flex p-2 justify-between items-center cursor-pointer">
        <div className="flex flex-row items-center justify-between">
          <Button className="mr-3" loading={!!isLoading} onClick={handleClick}>
            <GoTrashcan />
          </Button>
          {error && <div>Error deleting user.</div>}
          {name}
        </div>
      </div>
    </div>
  );
}

export default UsersListItem;
