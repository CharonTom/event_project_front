// src/pages/Calendar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface CalendarEvent {
  calendar_event_id: number;
  added_at: string;
  wants_reminder: boolean;
  reminder_7d_sent: boolean;
  reminder_7d_sent_at: string | null;
  reminder_1d_sent: boolean;
  reminder_1d_sent_at: string | null;
  event: {
    event_id: number;
    title: string;
    description: string;
    start_date: string;
  };
}

interface UserProfile {
  user_id: number;
  calendar: { calendar_id: number; events: CalendarEvent[] };
}

interface JWTPayload {
  id: number;
  iat: number;
  exp: number;
}

export default function CalendarPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      .get<UserProfile>(`http://localhost:3000/users/${payload.id}`, {
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
        `http://localhost:3000/users/${payload.id}/calendar/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
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
      <button
        onClick={() => navigate("/events/create")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Créer un événement
      </button>
    </div>
  );
}
