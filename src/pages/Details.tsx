// src/pages/Details.tsx
import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { EventContext } from "../contexts/EventContext";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export interface Event {
  event_id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  start_date: string;
  end_date: string;
  price: string;
  description: string;
  is_premium: boolean;
  image?: string;
  // à faire évoluer
}

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const Details = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const evt: Event | undefined = events.find((e) => e.event_id === eventId); // On compare l'id de l'événement passé dans l'url et celui de l'objet event dans l'API et on le stock
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  if (!evt) {
    // ici, evt est forcément undefined
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Événement introuvable…</p>
      </div>
    );
  }

  let userId: number | null = null;
  if (token) {
    try {
      const payload = jwtDecode<JWTPayload>(token);
      userId = payload.id; // On récupère l'id du User directement dans son Token
      console.log(userId);
    } catch {
      console.warn("Token invalide, impossible de récupérer l'userId");
    }
  }
  const AddEventToCalendar = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir ajouter cet événement de votre calendrier ?"
      )
    ) {
      try {
        await axios.post(
          `${BASE_URL}/users/${userId}/calendar/events`,
          {
            event_id: evt.event_id,
            wants_reminder: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(
          err.response?.data?.message ||
            "Erreur lors de l'ajout de l'événement."
        );
      }
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <img src={`${BASE_URL}${evt.image}`} />
      <h1 className="text-4xl font-extrabold">{evt.title}</h1>
      <div>
        <div className="flex items-center gap-x-4">
          <div>Date Logo</div>
          <div className="">
            <div>jour</div>
            <div>heure</div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div>Loc Logo</div>
          <div className="">
            <div>Lieu</div>
            <div>Adresse</div>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div>Profil pic</div>
          <div className="">
            <div>Organizer name</div>
            <div>Organizer</div>
          </div>
        </div>
      </div>
      <div>
        <p>Tags</p>
        <div>Lists of tags</div>
      </div>
      <div>
        <div>description</div>
        <div>{evt.description}</div>
      </div>
      <div className="bg-white shadow-lg rounded-2xl max-w-3xl w-full">
        {/* Contenu */}
        <div className="p-6 bg-pink-50 space-y-4">
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
          <button onClick={AddEventToCalendar}>Ajouter au Calendrier</button>
        </div>
      </div>
    </div>
  );
};

export default Details;
