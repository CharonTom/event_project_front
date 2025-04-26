// src/routes/index.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Details from "../pages/Details";
import Account from "../pages/Account";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import { PrivateRoute } from "./PrivateRoute";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* publiques */}
      <Route index element={<Home />} />
      <Route path="details" element={<Details />} />
      <Route path="login" element={<Login />} />

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
