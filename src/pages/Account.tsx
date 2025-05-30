// src/pages/Account.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import type { JWTPayload, UserProfile, Event } from "../types/types";
import axios from "axios";
import { TbChevronLeft } from "react-icons/tb";
import EventHomeCard from "../components/EventHomeCard";
import { GoPlusCircle } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";

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

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      return;
    }

    try {
      const { data } = await axios.get<Event[]>(
        `${BASE_URL}/users/${payload.id}/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {}
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
      <div className="mx-auto w-full max-w-2xl px-4">
        <div
          onClick={() => navigate("/")}
          className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
        >
          <TbChevronLeft className="text-3xl text-primary-darker" />
        </div>
        <div
          onClick={() => navigate("/events/create")}
          className="flex-center absolute top-8 right-8 rounded-xl cursor-pointer bg-white text-primary p-4"
        >
          <GoPlusCircle />
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

        {/* Aperçu de vos événements en cartes avec scroll horizontal */}
        {events.length > 0 && (
          <div className="mt-10 px-4 max-w-3xl mx-auto">
            <h2 className="mb-4">Vos Evénements</h2>
            <div className="flex space-x-4 overflow-x-scroll pb-4">
              {events.map((e) => (
                <div>
                  <EventHomeCard
                    key={e.event_id}
                    event={e}
                    baseUrl={BASE_URL}
                  />
                  <IoSettingsOutline
                    onClick={() => navigate(`/events/${e.event_id}/edit`)}
                    className="text-primary-darker text-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
