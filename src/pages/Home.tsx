// src/pages/Home.tsx
import { useContext } from "react";
import { EventContext } from "../contexts/EventContext";
import EventHomeCard from "../components/EventHomeCard";
import TodayHomeCard from "../components/TodayHomeCard";
import Logo from "../assets/logo-evently.png";
import HomeBanner from "../components/HomeBanner";
import type { Event } from "../types/types";

const Home = () => {
  const { events } = useContext(EventContext);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  console.log(events);

  const eventsByParent: Record<string, Event[]> = {};

  events.forEach((evt) => {
    const parents = evt.categories?.length
      ? Array.from(
          new Set(evt.categories.map((cat) => cat.parent?.name ?? cat.name)) // Set pour éviter les doublons, Array.from pour revenir à un tableau
        )
      : ["Sans catégorie"];

    parents.forEach((parent) => {
      if (!eventsByParent[parent]) {
        eventsByParent[parent] = []; // On créer les clés si elles n'existent pas avec un tableau vide en valeur
      }
      eventsByParent[parent].push(evt);
    });
  });

  const parentNames = Object.keys(eventsByParent); // Récupère les noms des catégories parentes

  return (
    <section className="pb-20">
      <div className="mx-auto w-full max-w-2xl px-4">
        <img className="w-32" src={Logo} alt="Logo de l'application"></img>
        <TodayHomeCard />
        {parentNames.map((parent) => (
          <div key={parent}>
            <h2 className="text-sm font-semibold text-gray-800">{parent}</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {eventsByParent[parent].map((evt) => (
                <EventHomeCard
                  key={evt.event_id}
                  event={evt}
                  baseUrl={BASE_URL}
                />
              ))}
            </div>
          </div>
        ))}
        <HomeBanner />
      </div>
    </section>
  );
};

export default Home;
