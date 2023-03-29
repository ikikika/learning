// step 1: create file
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// step 2: base type
const fetchUsers = createAsyncThunk("users/fetch", async () => {
  // step 3: make the request
  const response = await axios.get("http://localhost:3005/users");

  return response.data;
});

export { fetchUsers };
