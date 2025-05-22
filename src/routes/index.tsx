// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Details from "../pages/Details";
import Account from "../pages/Account";
import Login from "../auth/Login";
import Logout from "../auth/Logout";
import { PrivateRoute } from "./PrivateRoute";
import Register from "../auth/Register";
import EditAccount from "../pages/EditAccount";
import CreateEvent from "../pages/CreateEvent";
import Calendar from "../pages/Calendar";
import MyEvents from "../pages/MyEvents";
import EditMyEvent from "../pages/EditMyEvent";
import ChoicePage from "../auth/ChoicePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {/* publiques */}
      <Route index element={<Home />} />
      <Route path="details/:id" element={<Details />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="connection-gate" element={<ChoicePage />} />

      {/* protégées */}
      <Route element={<PrivateRoute />}>
        <Route path="account" element={<Account />} />
        <Route path="account/edit" element={<EditAccount />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="logout" element={<Logout />} />
        <Route path="/events/:id/edit" element={<EditMyEvent />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Route>
  </Routes>
);

export default AppRoutes;
