import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Adapte l'URL selon ton API NestJS
      const response = await axios.post<{ access_token: string }>(
        `${BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      setToken(response.data.access_token);
      navigate("/account", { replace: true }); // replace true pour éviter de revenir à la page de connexion avec le bouton "retour" du navigateur
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <section className="min-h-screen flex-center flex-col">
      <h1 className="text-2xl font-bold text-gray-900">
        Connectez vous à votre compte
      </h1>
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Se connecter
          </button>
          <p className="p-2">
            Pas encore inscrit ?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Inscrivez vous ici
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Login;
