// src/pages/Home.tsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../contexts/EventContext";
import { Event } from "../contexts/EventContext"; // Assure-toi que ton interface Event correspond bien à la forme retournée par l'API

const Home = () => {
  const { events } = useContext(EventContext);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Bienvenue !</h1>
      </header>

      <main className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((evt: Event) => (
          <div
            key={evt.event_id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
          >
            <div>
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-48 object-cover rounded-t-2xl mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {evt.title}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                📅 {formatDate(evt.start_date)} – {formatDate(evt.end_date)}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                📍 {evt.location}, {evt.city}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                💶 {parseFloat(evt.price).toFixed(2)} €
              </p>
            </div>
            <Link
              to={`/details/${evt.event_id}`}
              className="mt-4 inline-block text-center py-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Voir détails
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
