import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6">
        <Outlet />
      </main>
      <NavBar />
      {/* <Footer /> */}
    </div>
  );
}
