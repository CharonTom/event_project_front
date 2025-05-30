// src/components/EventHomeCard.tsx
import { Link, useNavigate } from "react-router-dom";
import { FaBookmark, FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { EventHomeCardProps, JWTPayload } from "../types/types";

const EventHomeCard = ({ event, baseUrl }: EventHomeCardProps) => {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Extract day and month for badge
  const badgeDay = new Date(event.start_date).toLocaleDateString("fr-FR", {
    day: "2-digit",
  });
  const badgeMonth = new Date(event.start_date).toLocaleDateString("fr-FR", {
    month: "long",
  });

  const handleAddToCalendar = async () => {
    if (!token) {
      setError("Vous devez être connecté pour ajouter cet événement.");
      navigate("/connection-gate");
      return;
    }

    let userId: number;
    try {
      const payload = jwtDecode<JWTPayload>(token);
      userId = payload.id;
    } catch {
      setError("Token invalide.");
      return;
    }

    if (!window.confirm("Ajouter cet événement à votre calendrier ?")) {
      return;
    }

    setError(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/users/${userId}/calendar/events`,
        { event_id: event.event_id, wants_reminder: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors de l'ajout au calendrier."
      );
    }
  };

  return (
    <div className="flex-shrink-0 flex-col justify-between">
      <Link
        to={`/details/${event.event_id}`}
        className="mt-4 inline-block rounded-xl"
      >
        <div className="relative">
          {event.image ? (
            <img
              src={`${baseUrl}${event.image}`}
              alt={event.title}
              className="w-60 h-[144px] object-cover rounded-2xl mb-4"
            />
          ) : (
            <div className="w-60 h-[144px] bg-gray-200 rounded-2xl mb-4" />
          )}
          <h3 className="font-semibold mb-2">{event.title}</h3>
          <p className="text-sm mb-1">
            Du {formatDate(event.start_date)} <br /> Au{" "}
            {formatDate(event.end_date)}
          </p>
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-x-1">
            <FaLocationDot /> {event.location}
            {event.city && `, ${event.city}`}
          </p>
          {event.categories && (
            <div>
              {event.categories.map((cat) => (
                <span key={cat.category_id} className="mr-2 text-[10px] tag">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Dynamic date badge */}
          <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-none h-10 w-10 rounded-lg flex-center">
            <div className="text-[10px] font-bold leading-none px-1 text-primary-darker text-center">
              {badgeDay} <br /> {badgeMonth}
            </div>
          </div>

          {/* Bookmark icon */}
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-none h-10 w-10 rounded-lg flex-center">
            <FaBookmark
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleAddToCalendar();
              }}
              className="text-primary-darker"
            />
          </div>
        </div>
      </Link>

      {/* Error message */}
      <div className="mt-3 flex items-center">
        {error && (
          <p className="text-red-500 text-xs ml-2">
            L'évenement est déjà ajouter à l'agenda
          </p>
        )}
      </div>
    </div>
  );
};

export default EventHomeCard;
