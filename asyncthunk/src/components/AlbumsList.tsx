import { useFetchAlbumsQuery, useAddAlbumMutation } from "../store";
import { AlbumType, UserType } from "../types";
import Skeleton from "./Skeleton";
import Button from "./Button";
import AlbumsListItem from "./AlbumsListItem";

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
      return (
        <AlbumsListItem key={album.id} id={album.id} title={album.title} />
      );
    });
  }

  return (
    <div>
      <div className="m-2 flex flex-row items-center justify-between">
        <h3 className="text-lg font-bold">Albums for {name}</h3>
        <Button loading={results.isLoading} onClick={handleAddAlbum}>
          + Add Album
        </Button>
      </div>
      <div>{content}</div>
    </div>
  );
}

export default AlbumsList;
