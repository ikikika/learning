import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserType } from "../../types";

const removeUser = createAsyncThunk("users/remove", async (user: UserType) => {
  // const response = await axios.delete(`http://localhost:3005/users/${user.id}`);

  // problem here is the axios delete request does not return anything (check from console.log in slice)
  // hence, this response.data will be blank
  // return response.data;

  axios.delete(`http://localhost:3005/users/${user.id}`);

  return user;
});

export { removeUser };
