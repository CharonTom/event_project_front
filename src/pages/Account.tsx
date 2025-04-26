// src/pages/Account.tsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string | null;
  calendar: { calendar_id: number };
}

interface JWTPayload {
  id: number; // <— ici on passe sur `id`
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function Account() {
  const { token } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    // 1) Décodage du token
    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
      console.log("JWT payload :", payload); // <— log global
    } catch (e) {
      console.error("Erreur de décodage JWT :", e);
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    const userId = payload.id; // <— on prend bien .id

    // 2) Appel GET /users/:id
    axios
      .get<UserProfile>(`http://localhost:3000/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        // Log détaillé de l’erreur 500
        console.error(
          "Erreur API /users/:id :",
          err.response?.status,
          err.response?.data
        );
        setError(
          err.response?.data?.message ||
            `Erreur ${err.response?.status} lors du chargement du profil.`
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div>Chargement du profil…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <p>
        <span className="font-semibold">Nom :</span> {user.first_name}{" "}
        {user.last_name}
      </p>
      <p>
        <span className="font-semibold">Email :</span> {user.email}
      </p>
      <p>
        <span className="font-semibold">Téléphone :</span> {user.phone}
      </p>

      <p>
        <span className="font-semibold">Inscrit le :</span>{" "}
        {new Date(user.created_at).toLocaleDateString()}
      </p>
      {user.updated_at && (
        <p>
          <span className="font-semibold">Dernière mise à jour :</span>{" "}
          {new Date(user.updated_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
