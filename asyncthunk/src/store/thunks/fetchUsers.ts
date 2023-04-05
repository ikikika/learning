// step 1: create file
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// step 2: base type
const fetchUsers = createAsyncThunk("users/fetch", async () => {
  // step 3: make the request
  const response = await axios.get("http://localhost:3005/users");

  // DEV ONLY!!!
  await pause(1000);

  return response.data;
});

// DEV ONLY!!!
const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export { fetchUsers };
