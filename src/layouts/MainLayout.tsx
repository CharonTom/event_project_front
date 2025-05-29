import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <Outlet />
      <NavBar />
    </main>
  );
}
