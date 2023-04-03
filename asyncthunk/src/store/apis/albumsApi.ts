// Step 2: Make a new file that will create the api

import { createApi } from "@reduxjs/toolkit/query/react";

const albumsApi = createApi({
  // step 3: add reducerPath
  reducerPath: "albums",
});
