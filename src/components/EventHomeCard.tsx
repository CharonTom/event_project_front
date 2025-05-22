// src/components/EventHomeCard.tsx
import { Link } from "react-router-dom";
import { Event } from "../contexts/EventContext";

interface EventHomeCardProps {
  event: Event;
  baseUrl: string;
} // src/components/EventHomeCard.tsx

const EventHomeCard: React.FC<EventHomeCardProps> = ({ event, baseUrl }) => {
  // formate une date ISO en chaîne au format français
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex-shrink-0 w-80 flex-col justify-between">
      <Link
        to={`/details/${event.event_id}`}
        className="mt-4 inline-block text-white rounded-xl"
      >
        <div>
          <div>
            {event.image && (
              <img
                src={`${baseUrl}${event.image}`}
                alt={event.title}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              📅 {formatDate(event.start_date)} – {formatDate(event.end_date)}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              📍 {event.location}
              {event.city && `, ${event.city}`}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventHomeCard;
