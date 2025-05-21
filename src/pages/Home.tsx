// src/pages/Home.tsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext, Event } from "../contexts/EventContext";

const Home = () => {
  const { events } = useContext(EventContext);
  console.log(events);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // formate une date ISO en chaîne au format français
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // On crée un objet pour regrouper les événements par nom de catégorie parente
  const eventsByParent: Record<string, Event[]> = {};

  // Parcours de chaque événement
  events.forEach((evt) => {
    //  Si evt.categories existe et contient au moins un élément…
    const parents = evt.categories?.length
      ? // Un Set n’est pas un tableau ; pour le transformer en tableau (afin de pouvoir boucler dessus, indexer, etc.), on utilise Array.from().
        Array.from(
          // Un Set en JavaScript est une collection de valeurs uniques. Passer le tableau au constructeur new Set(...) enlève automatiquement les doublons.
          new Set(evt.categories.map((cat) => cat.parent?.name ?? cat.name))
        )
      : ["Sans catégorie"];

    parents.forEach((parent) => {
      if (eventsByParent[parent] === undefined) {
        eventsByParent[parent] = [];
      }
      eventsByParent[parent].push(evt);
    });
  });

  // Récupère la liste des noms de catégories parentes
  const parentNames = Object.keys(eventsByParent);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-5xl text-gradient">Bienvenue</h1>
        <button className="btn-gradient">bg gradient</button>
        <button className="btn-gradient-border">
          <span className="text-gradient"> border gradient</span>
        </button>
      </header>

      {/* Pour chaque nom de parent, on crée une section */}
      <main className="max-w-6xl mx-auto space-y-12">
        {parentNames.map((parent) => (
          <section key={parent}>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              {parent}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {/* Pour chaque événement dans cette catégorie parente */}
              {eventsByParent[parent].map((evt) => (
                <div
                  key={evt.event_id}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    {evt.image && (
                      <img
                        src={`${BASE_URL}${evt.image}`}
                        alt={evt.title}
                        className="w-full h-40 object-cover rounded-t-2xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      📅 {formatDate(evt.start_date)} –{" "}
                      {formatDate(evt.end_date)}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      📍 {evt.location}
                      {evt.city && `, ${evt.city}`}
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
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Home;
