import React from "react";
import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Login from "./screens/Login";
import Public from "./screens/Public";
import UsersList from "./screens/Protected/Users";
import Welcome from "./screens/Protected/Welcome";
import RequireAuth from "./app/routing/RequireAuth";
import { PersistLogin } from "./app/routing/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="welcome" element={<Welcome />} />
            <Route path="userslist" element={<UsersList />} />
          </Route>{" "}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
