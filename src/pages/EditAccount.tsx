// src/pages/EditAccount.tsx
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { JWTPayload, UserProfile } from "../types/types";
import { TbChevronLeft } from "react-icons/tb";
import { CiLock, CiMail, CiPhone, CiUser } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function EditAccount() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    axios
      .get<UserProfile>(`${BASE_URL}/users/${payload.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            `Erreur ${err.response?.status} lors du chargement du profil.`
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { id: userId } = jwtDecode<JWTPayload>(token!);

    const payload: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    };
    if (password) {
      payload.password = password;
    }

    try {
      await axios.patch(`${BASE_URL}/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/setting", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour du profil."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Chargement des informations…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section className="py-24 min-h-screen relative">
      <div
        onClick={() => navigate("/setting")}
        className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl"
      >
        <TbChevronLeft className="text-3xl text-primary-darker" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <CiMail className="m-2 text-2xl" />
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
          <CiPhone className="m-2 text-2xl" />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2"
            placeholder="Nouveau Mot de passe"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="m-2 text-2xl text-gray-500 focus:outline-none"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        {/* <div>
          <p>Nom</p>
          <input
            type="text"
            placeholder="Nom"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <p>Email</p>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <p>Téléphone</p>
          <input
            type="tel"
            placeholder="Téléphone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <p>Nouveau mot de passe</p>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div> */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 px-4 text-white rounded-md 
            ${saving ? "bg-gray-400" : "bg-primary "}`}
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
}
