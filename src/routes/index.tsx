// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Details from "../pages/Details";
import Account from "../pages/Account";
import Login from "../auth/Login";
import Logout from "../auth/Logout";
import { PrivateRoute } from "./PrivateRoute";
import Register from "../auth/Register";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* publiques */}
      <Route index element={<Home />} />
      <Route path="details" element={<Details />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="account" element={<Account />} />
        <Route path="logout" element={<Logout />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Route>
  </Routes>
);

export default AppRoutes;
