import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci";

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
    <section className="min-h-screen flex-center bg-[#F7F8FA]">
      <div className="w-[75%]">
        <h1 className="text-[32px] font-bold">Connectez vous à votre compte</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md">
            <div className="mb-4">
              <div className="flex-center bg-white p-2">
                <CiUser className="m-2 text-2xl" />
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
                  className="w-full px-3 py-2"
                  placeholder="Email"
                />
                <div></div>
              </div>
            </div>
            <div>
              <div className="flex-center bg-white p-2">
                <CiLock className="m-2 text-2xl" />
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
                  className="rounded  w-full px-3 py-2"
                  placeholder="Mot de passe"
                />
                <FaEye className="text-2xl m-2" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex-center py-4 px-4 text-sm rounded-md text-white bg-primary"
            >
              Se connecter
            </button>
            <p className="p-2 text-sm text-gray-500">
              Pas encore inscrit ?{" "}
              <Link to="/register" className="">
                Inscrivez vous ici
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
