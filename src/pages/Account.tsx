// src/pages/Account.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import type { JWTPayload, UserProfile } from "../types/types";

import axios from "axios";

export default function Account() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get<UserProfile>(
        `${BASE_URL}/users/${payload.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors du chargement du profil.`
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [token, fetchProfile]);

  if (loading) return <div>Chargement du profil…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Mon profil</h1>

      <p>
        <span className="font-semibold">Nom :</span> {user.first_name}{" "}
        {user.last_name}
      </p>

      <div className="flex space-x-4 pt-4">
        <button
          onClick={() => navigate("/my-events")}
          className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Mes événements
        </button>
      </div>
    </div>
  );
}
