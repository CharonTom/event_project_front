import { NavLink } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

export default function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary font-semibold transition-colors"
      : "text-grey-text hover:text-blue-800 transition-colors";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-grey-bg shadow py-4 px-4 flex justify-center z-50">
      <nav className="flex gap-x-8">
        <NavLink to="/" className={linkClasses}>
          <FaHome className="text-2xl" />
        </NavLink>
        <NavLink to="/explore" className={linkClasses}>
          <FaSearch className="text-2xl" />
        </NavLink>
        <NavLink to="/account" className={linkClasses}>
          <FaUser className="text-2xl" />
        </NavLink>
        <NavLink to="/calendar" className={linkClasses}>
          <FaRegCalendarAlt className="text-2xl" />
        </NavLink>
      </nav>
    </div>
  );
}
