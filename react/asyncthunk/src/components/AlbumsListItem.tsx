import { GoTrashcan } from "react-icons/go";
import Button from "./Button";
import ExpandablePanel from "./ExpandablePanel";
import { AlbumType } from "../types";

function AlbumsListItem({ id, title }: AlbumType) {
  const header = (
    <div className="flex flex-row items-center justify-between">
      <Button onClick={() => null}>
        <GoTrashcan />
      </Button>
      {title}
    </div>
  );

  return (
    <ExpandablePanel key={id} header={header}>
      List of photos in the album
    </ExpandablePanel>
  );
}

export default AlbumsListItem;
