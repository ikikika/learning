import { useFetchAlbumsQuery, useAddAlbumMutation } from "../store";
import { UserType } from "../types";
import Skeleton from "./Skeleton";
import ExpandablePanel from "./ExpandablePanel";
import Button from "./Button";

interface AlbumType {
  id: number;
  title: string;
}

function AlbumsList({ id, name }: UserType) {
  // step 9: use hook
  const { data, error, isLoading } = useFetchAlbumsQuery({ id, name });
  const [addAlbum, results] = useAddAlbumMutation();

  const handleAddAlbum = () => {
    addAlbum({ id, name });
  };

  let content;
  if (isLoading) {
    content = <Skeleton times={3} className="h-10 w-full" />;
  } else if (error) {
    content = <div>Error loading data</div>;
  } else {
    content = data.map((album: AlbumType) => {
      const header = <div>{album.title}</div>;
      return (
        <ExpandablePanel key={album.id} header={header}>
          List of photos
        </ExpandablePanel>
      );
    });
  }

  return (
    <div>
      <div>
        Albums for {name}
        <Button onClick={handleAddAlbum}>+ Add Album</Button>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default AlbumsList;
