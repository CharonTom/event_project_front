// src/pages/EditAccount.tsx
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

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
      .get<UserProfile>(`http://localhost:3000/users/${payload.id}`, {
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
      await axios.patch(`http://localhost:3000/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/account", { replace: true });
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
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-center">Modifier mon profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p>Prénom</p>
          <input
            type="text"
            placeholder="Prénom"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
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
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-2 px-4 text-white rounded-md 
            ${saving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}
            focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
