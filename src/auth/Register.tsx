import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { TbChevronLeft } from "react-icons/tb";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setToken } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

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
    <section className="min-h-screen flex-center bg-[#F7F8FA] py-30">
      <div className="w-[75%]">
        <div
          onClick={() => navigate("/connection-gate")}
          className="flex-center absolute top-12 left-12 bg-white h-12 w-12 rounded-xl"
        >
          <TbChevronLeft className="text-3xl text-primary-darker" />
        </div>
        <h1 className="text-[32px] font-bold">Créez votre compte</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* Prénom */}
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="text"
                placeholder="Prénom"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            {/* Nom */}
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="text"
                placeholder="Nom"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            {/* Email */}
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
            {/* Téléphone */}
            <div className="flex-center bg-white p-2 rounded">
              <CiUser className="m-2 text-2xl" />
              <input
                type="tel"
                placeholder="Téléphone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            {/* Mot de passe */}
            <div className="flex-center bg-white p-2 rounded">
              <CiLock className="m-2 text-2xl" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Inscription…" : "S’inscrire"}
            </button>
          </div>
        </form>
        <p className="p-2 text-xs text-gray-500">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-primary underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
