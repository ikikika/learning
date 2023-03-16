import React from "react";
import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Login from "./screens/Login";
import Public from "./screens/Public";
import UsersList from "./screens/Users";
import Welcome from "./screens/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="welcome" element={<Welcome />} />
        <Route path="userslist" element={<UsersList />} />
      </Route>
    </Routes>
  );
}

export default App;
