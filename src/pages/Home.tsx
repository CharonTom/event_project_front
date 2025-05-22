// src/pages/Home.tsx
import { useContext } from "react";
import { EventContext, Event } from "../contexts/EventContext";
import EventHomeCard from "../components/EventHomeCard";

const Home: React.FC = () => {
  const { events } = useContext(EventContext);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // Regroupe les événements par nom de catégorie parente
  const eventsByParent: Record<string, Event[]> = {};
  events.forEach((evt) => {
    const parents = evt.categories?.length
      ? Array.from(
          new Set(evt.categories.map((cat) => cat.parent?.name ?? cat.name))
        )
      : ["Sans catégorie"];

    parents.forEach((parent) => {
      if (!eventsByParent[parent]) {
        eventsByParent[parent] = [];
      }
      eventsByParent[parent].push(evt);
    });
  });

  const parentNames = Object.keys(eventsByParent);

  return (
    <section className="max-w-6xl mx-auto space-y-12">
      {parentNames.map((parent) => (
        <section key={parent}>
          <h2 className="text-sm font-semibold text-gray-800 mb-4">{parent}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {eventsByParent[parent].map((evt) => (
              <EventHomeCard
                key={evt.event_id}
                event={evt}
                baseUrl={BASE_URL}
              />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default Home;
