import { GoTrashcan } from "react-icons/go";
import Button from "./Button";
import ExpandablePanel from "./ExpandablePanel";
import { AlbumType } from "../types";
import { useRemoveAlbumMutation } from "../store/apis/albumsApi";
import PhotosList from "./PhotosList";

function AlbumsListItem({ id, title }: AlbumType) {
  const [removeAlbum, results] = useRemoveAlbumMutation();

  const handleRemoveAlbum = () => {
    removeAlbum({ id, title });
  };

  const header = (
    <div className="flex flex-row items-center justify-between">
      <Button
        className="mr-2"
        loading={results.isLoading}
        onClick={handleRemoveAlbum}
      >
        <GoTrashcan />
      </Button>
      {title}
    </div>
  );

  return (
    <ExpandablePanel key={id} header={header}>
      <PhotosList album={{ id, title }} />
    </ExpandablePanel>
  );
}

export default AlbumsListItem;
