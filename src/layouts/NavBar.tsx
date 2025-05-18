import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-700 font-semibold border-b-2 border-blue-700 transition-colors"
      : "text-blue-600 hover:text-blue-800 transition-colors";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-100 shadow py-6 px-4 flex justify-center z-50">
      <nav className="flex gap-x-8">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/explore" className={linkClasses}>
          Explore
        </NavLink>
        <NavLink to="/account" className={linkClasses}>
          Profil
        </NavLink>
        <NavLink to="/calendar" className={linkClasses}>
          Agenda
        </NavLink>
      </nav>
    </div>
  );
}
