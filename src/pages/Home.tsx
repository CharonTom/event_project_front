// src/pages/Home.tsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext, Event } from "../contexts/EventContext";

const Home = () => {
  const { events } = useContext(EventContext);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Regroupement par catégorie parente
  const eventsByParent: Record<string, Event[]> = {};
  events.forEach((evt) => {
    const parents = evt.categories?.length
      ? Array.from(
          new Set(evt.categories.map((cat) => cat.parent?.name ?? cat.name))
        )
      : ["Sans catégorie"];

    parents.forEach((parent) => {
      (eventsByParent[parent] ??= []).push(evt);
    });
  });

  // Optionnel : ordre fixe des sections
  const desiredOrder = ["Sport", "Musique", "Technologies"];
  const parentNames = Object.keys(eventsByParent).sort((a, b) => {
    // 1) Cas spécial : "Sans catégorie" toujours en dernier
    if (a === "Sans catégorie") return 1;
    if (b === "Sans catégorie") return -1;

    // 2) Ensuite, gestion des catégories prioritaires
    const iA = desiredOrder.indexOf(a);
    const iB = desiredOrder.indexOf(b);
    if (iA >= 0 || iB >= 0) {
      // ceux qui ne sont pas trouvés sont traités comme Infinity
      return (iA === -1 ? Infinity : iA) - (iB === -1 ? Infinity : iB);
    }

    // 3) Enfin, alphabétique pour le reste
    return a.localeCompare(b, "fr");
  });

  const base = import.meta.env.VITE_API_URL ?? "";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Bienvenue !</h1>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {parentNames.map((parent) => (
          <section key={parent}>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              {parent}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {eventsByParent[parent].map((evt) => (
                <div
                  key={evt.event_id}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    {evt.image && (
                      <img
                        src={`${base}${evt.image}`}
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
