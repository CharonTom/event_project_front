// src/pages/Events.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface Category {
  category_id: number;
  name: string;
}

interface EventItem {
  event_id: number;
  title: string;
  description: string;
  start_date: string;
  image: string | null;
  categories: Category[];
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
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

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
        `${BASE_URL}/users/${payload.id}/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(data);
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet événement ?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyEvents();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors de la suppression.`
      );
    }
  };

  if (loading) return <div>Chargement de vos événements…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Mes événements</h1>

      {events.length === 0 ? (
        <p>Vous n'avez encore créé aucun événement.</p>
      ) : (
        <ul className="space-y-6">
          {events.map((ev) => (
            <li
              key={ev.event_id}
              className="p-4 border rounded-lg flex flex-col sm:flex-row sm:space-x-6"
            >
              {/* Image */}
              {ev.image && (
                <img
                  src={`${BASE_URL}${ev.image}`}
                  alt={ev.title}
                  className="w-full h-48 sm:w-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{ev.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(ev.start_date).toLocaleString()}
                  </p>
                  {ev.description && <p className="mb-2">{ev.description}</p>}
                  {/* Catégories */}
                  <div className="flex flex-wrap gap-2">
                    {ev.categories.map((cat) => (
                      <span
                        key={cat.category_id}
                        className="text-xs bg-gradient-to-b from-[#56d2d2]  to-[#593ea1] inline-block text-transparent bg-clip-text px-2 py-1 rounded-full border border-gray-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2 justify-end">
                  <button
                    onClick={() => navigate(`/events/${ev.event_id}/edit`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(ev.event_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
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
