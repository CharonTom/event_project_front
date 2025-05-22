import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ← état pour le mot de passe

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<{ access_token: string }>(
        `${BASE_URL}/auth/register`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
        }
      );
      // l'API retourne directement access_token
      setToken(response.data.access_token);
      navigate("/account", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors de l’enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex-center bg-[#F7F8FA]">
      <div className="">
        <h1 className="text-[32px] font-bold text-gray-900 mb-8">
          Créez votre <br />
          compte
        </h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div className="flex-center flex-col gap-y-4 w-full">
          <form
            className="w-full mt-4 flex-center flex-col gap-y-4"
            onSubmit={handleSubmit}
          >
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="text"
                placeholder="Prénom"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded px-3 py-2"
              />
            </div>
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="text"
                placeholder="Nom"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded px-3 py-2"
              />
            </div>

            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
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
            </div>
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="tel"
                placeholder="Téléphone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full  rounded px-3 py-2"
              />
            </div>

            <div className="flex-center bg-white p-2 rounded">
              <CiLock className="m-2 text-2xl" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // ← type dynamique
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2"
                placeholder="Mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="m-2 text-2xl focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex-center py-5 px-4 border border-transparent text-sm font-medium rounded-md 
                       text-white bg-primary w-full"
            >
              {loading ? "Inscription…" : "S’inscrire"}
            </button>
          </form>
          <p className="mb-16 text-sm text-gray">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="">
              Connectez vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
