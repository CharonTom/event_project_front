// src/pages/Calendar.tsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { CalendarEvent, UserProfile, JWTPayload } from "../types/types";

export default function CalendarPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const fetchEvents = () => {
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

    axios
      .get<UserProfile>(`${BASE_URL}/users/${payload.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data.calendar.events))
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            `Erreur ${err.response?.status} lors du chargement du calendrier.`
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    fetchEvents();
  }, [token]);

  const removeFromCalendar = async (eventId: number) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet événement de votre calendrier ?"
      )
    ) {
      return;
    }
    try {
      const payload = jwtDecode<JWTPayload>(token!);
      await axios.delete(
        `${BASE_URL}/users/${payload.id}/calendar/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la suppression de l'événement."
      );
    }
  };

  if (loading) return <div>Chargement du calendrier…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-bold">Mon calendrier</h1>
      {events.length === 0 ? (
        <p>Aucun événement enregistré.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((ce) => (
            <li
              key={ce.calendar_event_id}
              className="p-4 border rounded-lg space-y-2"
            >
              <p>
                <span className="font-semibold">Titre :</span> {ce.event.title}
              </p>
              <p>
                <span className="font-semibold">Date :</span>{" "}
                {new Date(ce.event.start_date).toLocaleString()}
              </p>
              {ce.wants_reminder && (
                <p className="text-sm text-gray-600">Rappel activé</p>
              )}
              <button
                onClick={() => removeFromCalendar(ce.event.event_id)}
                className="text-red-600 hover:underline"
              >
                Supprimer de mon calendrier
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
