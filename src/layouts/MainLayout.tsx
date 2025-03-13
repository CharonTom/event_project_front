import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-700 font-semibold border-b-2 border-blue-700 transition-colors"
      : "text-blue-600 hover:text-blue-800 transition-colors";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 shadow p-4">
        <nav className="flex space-x-6 justify-center">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/details" className={linkClasses}>
            Details
          </NavLink>
          <NavLink to="/account" className={linkClasses}>
            Account
          </NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-sm text-gray-500">
        © 2025 - Tous droits réservés.
      </footer>
    </div>
  );
}
