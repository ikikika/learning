import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserType } from "../../types";

const removeUser = createAsyncThunk("users/remove", async (user: UserType) => {
  const response = await axios.delete(`http://localhost:3005/users/${user.id}`);

  // FIX !!!!
  return response.data;
});

export { removeUser };
