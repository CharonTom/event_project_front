import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
}
