import { UserType } from "../types";
import { GoTrashcan } from "react-icons/go";
import Button from "./Button";
import { removeUser } from "../store";
import { useThunk } from "../hooks/useThunk";
import ExpandablePanel from "./ExpandablePanel";
import AlbumsList from "./AlbumsList";

function UsersListItem({ id, name }: UserType) {
  const [doRemoveUser, isLoading, error] = useThunk(removeUser);

  const handleClick = () => {
    if (typeof doRemoveUser === "function") {
      doRemoveUser({ id, name });
    }
  };

  const header = (
    <>
      <Button className="mr-3" loading={!!isLoading} onClick={handleClick}>
        <GoTrashcan />
      </Button>
      {error && <div>Error deleting user.</div>}
      {name}
    </>
  );

  return (
    <ExpandablePanel header={header}>
      <AlbumsList name={name} />
    </ExpandablePanel>
  );
}

export default UsersListItem;
