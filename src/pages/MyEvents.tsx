// src/pages/Events.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface EventItem {
  event_id: number;
  title: string;
  description: string;
  start_date: string;
}

interface JWTPayload {
  id: number;
  iat: number;
  exp: number;
}

export default function Events() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = useCallback(async () => {
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
      const { data } = await axios.get<EventItem[]>(
        `http://localhost:3000/users/${payload.id}/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors du chargement des événements.`
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  if (loading) return <div>Chargement de vos événements…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Mes événements</h1>

      {events.length === 0 ? (
        <p>Vous n'avez encore créé aucun événement.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((ev) => (
            <li key={ev.event_id} className="p-4 border rounded-lg space-y-2">
              <p>
                <span className="font-semibold">Titre :</span> {ev.title}
              </p>
              <p>
                <span className="font-semibold">Date :</span>{" "}
                {new Date(ev.start_date).toLocaleString()}
              </p>
              {ev.description && (
                <p>
                  <span className="font-semibold">Description :</span>{" "}
                  {ev.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate("/events/create")}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Créer un nouvel événement
      </button>
    </div>
  );
}
