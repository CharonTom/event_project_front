// src/components/Header.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { token } = useAuth();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-700 font-semibold border-b-2 border-blue-700 transition-colors"
      : "text-blue-600 hover:text-blue-800 transition-colors";

  return (
    <header className="bg-gray-100 shadow py-6 px-18 flex justify-between items-center">
      <div>Logo</div>
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
    </header>
  );
}
