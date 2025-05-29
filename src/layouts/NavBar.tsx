import { NavLink } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export default function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-grey-text hover:text-blue-800";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-grey-bg shadow py-4 px-4 flex justify-center z-50">
      <div className="mx-auto w-full max-w-2xl px-4">
        <nav className="flex w-full">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <FaHome className="text-2xl" />
            <p className="text-[10px]">Accueil</p>
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <FaSearch className="text-2xl" />
            <p className="text-[10px]">Rechercher</p>
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <FaUser className="text-2xl" />
            <p className="text-[10px]">Profil</p>
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <FaRegCalendarAlt className="text-2xl" />
            <p className="text-[10px]">Agenda</p>
          </NavLink>
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center text-center transition-colors ${linkClasses(
                { isActive }
              )}`
            }
          >
            <IoSettingsOutline className="text-2xl" />
            <p className="text-[10px]">Paramètres</p>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
