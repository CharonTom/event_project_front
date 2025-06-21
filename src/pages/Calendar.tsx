import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { CalendarEvent, UserProfile, JWTPayload } from "../types/types";
import { TbChevronLeft, TbX } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CiBellOn } from "react-icons/ci";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
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

  // Filtre des événements selon la date actuelle
  const now = new Date();
  const filteredEvents = events.filter((ce) => {
    const eventDate = new Date(ce.event.start_date);
    return filter === "upcoming" ? eventDate > now : eventDate < now;
  });

  return (
    <section className="p-0 flex flex-col min-h-screen relative">
      {/* Bouton retour */}
      <div
        onClick={() => navigate("/")}
        className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
      >
        <TbChevronLeft className="text-3xl text-primary" />
      </div>

      {/* Titre */}
      <h1 className="text-xl text-center mt-16 mb-4">Mon Agenda</h1>

      {/* Boutons de filtre */}
      <div className="flex-center space-x-4 mb-6 bg-gray-200 rounded-3xl p-1 mx-auto">
        <button
          onClick={() => setFilter("upcoming")}
          className={`py-1 px-3 rounded-2xl font-medium focus:outline-none transition 
            ${
              filter === "upcoming" ? "bg-white text-primary" : "text-gray-600"
            }`}
        >
          À VENIR
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`py-1 px-3 rounded-full font-medium focus:outline-none transition 
            ${filter === "past" ? "bg-white text-primary" : "text-gray-600"}`}
        >
          PASSÉ
        </button>
      </div>

      {/* Container gradient à partir du titre jusqu'en bas */}
      <div className="flex-1 bg-gradient-to-t from-[#845def] to-[#56d2d2] p-6 rounded-2xl">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-white">
            {filter === "upcoming"
              ? "Il n'y a pas d'événements à venir."
              : "Il n'y a pas d'événements passés."}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((ce) => (
              <div
                key={ce.calendar_event_id}
                className="relative bg-white p-4 rounded-lg shadow-md space-y-2"
              >
                <button
                  onClick={() => removeFromCalendar(ce.event.event_id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                  aria-label="Supprimer"
                >
                  <TbX size={20} />
                </button>
                <p className="font-semibold">{ce.event.title}</p>
                <p>{new Date(ce.event.start_date).toLocaleString()}</p>
                {ce.wants_reminder && (
                  <div className="flex items-center space-x-2">
                    <CiBellOn />
                    <p className="text-sm text-gray-600">Rappel activé</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
