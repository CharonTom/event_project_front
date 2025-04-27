// src/pages/Details.tsx
import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EventContext } from "../contexts/EventContext";

const Details = () => {
  const { id } = useParams<{ id: string }>();

  const eventId = Number(id);
  const navigate = useNavigate();
  const { events } = useContext(EventContext);

  const evt = events.find((e) => e.event_id === eventId); // Vérification sur l'évenement de l'url et le même que celui de l'event dans l'API

  if (!evt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Événement introuvable…</p>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl max-w-3xl w-full">
        {/* Bannière */}
        <div className="bg-indigo-600 rounded-t-2xl p-6">
          <h1 className="text-4xl font-extrabold text-white">{evt.title}</h1>
          <p className="mt-1 text-indigo-200">
            {evt.city} • {formatDate(evt.start_date)}
          </p>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Dates</h2>
              <p className="text-gray-600">{formatDate(evt.start_date)}</p>
              <p className="text-gray-600">{formatDate(evt.end_date)}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Lieu</h2>
              <p className="text-gray-600">
                {evt.location}, {evt.city}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Description</h2>
            <p className="text-gray-800 leading-relaxed">{evt.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Tarif</h2>
              <p className="text-gray-600">
                {parseFloat(evt.price).toFixed(2)} €
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Premium</h2>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                  evt.is_premium
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {evt.is_premium ? "Oui" : "Non"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            ← Retour
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Voir tous les événements
          </Link>
          <button>Ajouter au Calendrier</button>
        </div>
      </div>
    </div>
  );
};

export default Details;
