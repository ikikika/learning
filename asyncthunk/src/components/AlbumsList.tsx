import { useFetchAlbumsQuery } from "../store";
import { UserType } from "../types";

function AlbumsList({ id, name }: UserType) {
  // step 9: use hook
  const { data, error, isLoading } = useFetchAlbumsQuery({ id, name });

  console.log(data, error, isLoading);
  return <div>Albums for {name}</div>;
}

export default AlbumsList;
