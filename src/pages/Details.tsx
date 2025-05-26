// src/pages/Details.tsx
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventContext } from "../contexts/EventContext";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { Event, JWTPayload } from "../types/types";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

const Details = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const evt: Event | undefined = events.find((e) => e.event_id === eventId); // On compare l'id de l'événement passé dans l'url et celui de l'objet event dans l'API et on le stock

  if (!evt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Événement introuvable…</p>
      </div>
    );
  }

  let userId: number;
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
    if (!token) {
      navigate("/connection-gate");
      return;
    }
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
    <div className="min-h-screen bg-gray-50 p-4">
      <img
        className="rounded-2xl h-[400px] object-cover mx-auto my-4"
        src={`${BASE_URL}${evt.image}`}
      />
      <h1 className="text-xl">{evt.title}</h1>
      <div className="my-4">
        <div className="flex items-center gap-x-4">
          {/* <FaCalendarAlt className=" bg-white p-4 rounded-sm" /> */}
          <div className="bg-white p-2 rounded-lg">
            <FaCalendarAlt className="" />
          </div>
          <div className="text-sm">
            <p className="text-gray-600">{formatDate(evt.start_date)}</p>
            <p className="text-gray-600">{formatDate(evt.end_date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="bg-white p-2 rounded-lg">
            <FaLocationDot className="" />
          </div>
          <div className="text-sm">
            {evt.location}, {evt.city}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="text-sm">
            <div>Organizer</div>
          </div>
          <div className="ml-auto btn-gradient-border">+ Suivre</div>
        </div>
      </div>
      <div className="bg-green-200 mb-6">
        <p className="font-bold">Tags</p>
        <div>Lists of tags</div>
      </div>
      <div>
        <div>description</div>
        <div>{evt.description}</div>
      </div>
      <div className="bg-white shadow-lg rounded-2xl max-w-3xl w-full">
        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button onClick={AddEventToCalendar}>Ajouter au Calendrier</button>
        </div>
      </div>
    </div>
  );
};

export default Details;
