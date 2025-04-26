import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { token } = useAuth();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-700 font-semibold border-b-2 border-blue-700 transition-colors"
      : "text-blue-600 hover:text-blue-800 transition-colors";

  return (
    <header className="bg-gray-100 shadow p-4">
      <nav className="flex space-x-6 justify-center">
        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>
        <NavLink to="/details" className={linkClasses}>
          Details
        </NavLink>
        <NavLink to="/register" className={linkClasses}>
          Créer un compte
        </NavLink>

        {/* Affiche Login si pas connecté */}
        {!token && (
          <NavLink to="/login" className={linkClasses}>
            Se connecter
          </NavLink>
        )}

        {/* Affiche Account et Logout si connecté */}
        {token && (
          <>
            <NavLink to="/account" className={linkClasses}>
              Mon profil
            </NavLink>
            <NavLink to="/logout" className={linkClasses}>
              Se déconnecter
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
