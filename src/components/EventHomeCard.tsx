// src/components/EventHomeCard.tsx
import { Link } from "react-router-dom";
import { Event } from "../contexts/EventContext";
import { FaBookmark } from "react-icons/fa6";

interface EventHomeCardProps {
  event: Event;
  baseUrl: string;
} // src/components/EventHomeCard.tsx

const EventHomeCard: React.FC<EventHomeCardProps> = ({ event, baseUrl }) => {
  // formate une date ISO en chaîne au format français.
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex-shrink-0 flex-col justify-between">
      <Link
        to={`/details/${event.event_id}`}
        className="mt-4 inline-block rounded-xl"
      >
        <div className="relative">
          <div>
            {event.image ? (
              <img
                src={`${baseUrl}${event.image}`}
                alt={event.title}
                className="w-60 h-[144px] object-cover rounded-2xl mb-4"
              />
            ) : (
              <div className="w-60 h-[144px] bg-gray-200 rounded-2xl mb-4"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold  mb-2">{event.title}</h3>
            <p className="text-sm mb-1">
              Du {formatDate(event.start_date)} <br /> Au{" "}
              {formatDate(event.end_date)}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              📍{event.location}
              {event.city && `, ${event.city}`}
            </p>
            {event.categories && (
              <div>
                {event.categories.map((cat) => (
                  <span
                    key={cat.category_id}
                    className="mr-2 text-[10px] tag-gradient-border"
                  >
                    <span className="text-gradient">{cat.name}</span>
                  </span>
                ))}
              </div>
            )}
            {event.price && (
              <button className="btn-gradient my-4 text-xs">
                {event.price} €
              </button>
            )}
          </div>
          <div className="text-center absolute top-2 left-2 bg-gray-100/60 backdrop-blur-md h-10 w-10 rounded-lg flex-center">
            <div className=" text-[10px] font-bold leading-none  px-1">
              <span className="text-gradient">24</span> <br />
              <span className="text-gradient">Avril</span>
            </div>
          </div>
          <div className="text-center absolute top-2 right-2 bg-gray-200/60 backdrop-blur-md h-10 w-10 rounded-lg flex-center">
            <div className="font-bold leading-none px-1 text-gradient">
              <FaBookmark className="text-primary" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventHomeCard;
