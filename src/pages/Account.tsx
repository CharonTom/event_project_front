// src/pages/Account.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import type { JWTPayload, UserProfile, Event } from "../types/types";
import axios from "axios";
import { TbChevronLeft } from "react-icons/tb";
import EventHomeCard from "../components/EventHomeCard";

// Utility to capitalize a name
const capitalize = (str: string = ""): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Utility to get user initials
const getInitials = (first?: string | null, last?: string | null): string => {
  const f = first ? first.charAt(0).toUpperCase() : "";
  const l = last ? last.charAt(0).toUpperCase() : "";
  return `${f}${l}`;
};

export default function Account() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get<UserProfile>(
        `${BASE_URL}/users/${payload.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors du chargement du profil.`
      );
    } finally {
      setLoading(false);
    }
  }, [token, BASE_URL]);

  const fetchMyEvents = useCallback(async () => {
    if (!token) return;
    setLoadingEvents(true);
    setErrorEvents(null);

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setErrorEvents("Token invalide.");
      setLoadingEvents(false);
      return;
    }

    try {
      const { data } = await axios.get<Event[]>(
        `${BASE_URL}/users/${payload.id}/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(data);
    } catch (err: any) {
      setErrorEvents(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors du chargement des événements.`
      );
    } finally {
      setLoadingEvents(false);
    }
  }, [token, BASE_URL]);

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    fetchProfile();
    fetchMyEvents();
  }, [token, fetchProfile, fetchMyEvents]);

  if (loading) return <div>Chargement du profil…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section className="py-24 min-h-screen relative">
      <div
        onClick={() => navigate("/")}
        className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
      >
        <TbChevronLeft className="text-3xl text-primary-darker" />
      </div>
      <div
        onClick={() => navigate("/events/create")}
        className="flex-center absolute top-8 right-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
      >
        Créer
      </div>

      <div className="text-center flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-6">
          <div className="text-white text-3xl bg-primary rounded-full h-20 w-20 flex-center font-bold">
            {getInitials(user?.first_name, user?.last_name)}
          </div>
        </div>
        <div className="text-xl font-semibold">
          {capitalize(user?.first_name)} {capitalize(user?.last_name)}
        </div>
      </div>

      <div className="mt-6 flex-center gap-x-8 text-center text-sm text-gray-600">
        <p>
          <strong>350</strong> <br /> Following
        </p>
        <p>
          <strong>346</strong> <br /> Followers
        </p>
      </div>

      <div className="flex items-center justify-between p-4 mt-3 border-b">
        <div>ABOUT</div>
        <div className="text-primary border-b-2">MES ÉVÉNEMENTS</div>
        <div>AVIS</div>
      </div>

      {/* Liste classique en UL */}
      <div className="mt-8 max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Mes événements</h2>

        {loadingEvents ? (
          <div>Chargement de vos événements…</div>
        ) : errorEvents ? (
          <div className="text-red-600">{errorEvents}</div>
        ) : events.length === 0 ? (
          <p>Vous n'avez encore créé aucun événement.</p>
        ) : (
          <ul className="space-y-6">
            {events.map((ev) => (
              <li
                key={ev.event_id}
                className="p-4 border rounded-lg flex flex-col sm:flex-row sm:space-x-6"
              >
                {ev.image && (
                  <img
                    src={`${BASE_URL}${ev.image}`}
                    alt={ev.title}
                    className="w-full h-48 sm:w-48 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(ev.start_date).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {ev.description && <p className="mb-2">{ev.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      {ev.categories?.map((cat) => (
                        <span
                          key={cat.category_id}
                          className="text-xs bg-gradient-to-b from-[#56d2d2] to-[#593ea1] inline-block text-transparent bg-clip-text px-2 py-1 rounded-full border border-gray-300"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2 justify-end">
                    <button
                      onClick={() => navigate(`/events/${ev.event_id}/edit`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "Voulez-vous vraiment supprimer cet événement ?"
                          )
                        )
                          return;
                        try {
                          await axios.delete(
                            `${BASE_URL}/events/${ev.event_id}`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          fetchMyEvents();
                        } catch (err: any) {
                          alert(
                            err.response?.data?.message ||
                              `Erreur ${err.response?.status} lors de la suppression.`
                          );
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => navigate("/events/create")}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Créer un nouvel événement
        </button>
      </div>

      {/* Aperçu de vos événements en cartes avec scroll horizontal */}
      {events.length > 0 && (
        <div className="mt-10 px-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Vos événements en aperçu
          </h2>
          <div className="flex space-x-4 overflow-x-scroll pb-4">
            {events.map((e) => (
              <EventHomeCard key={e.event_id} event={e} baseUrl={BASE_URL} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
