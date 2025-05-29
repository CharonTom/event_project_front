// src/pages/Details.tsx
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventContext } from "../contexts/EventContext";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import type { Event, JWTPayload } from "../types/types";
import { FaLocationDot } from "react-icons/fa6";
import { FaBookmark, FaCalendarAlt } from "react-icons/fa";
import { TbChevronLeft, TbChevronDown } from "react-icons/tb";
import EventHomeCard from "../components/EventHomeCard";

const Details = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const evt: Event | undefined = events.find((e) => e.event_id === eventId);

  // State to control accordion
  const [isOpen, setIsOpen] = useState(false);

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
      userId = payload.id;
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
        "Êtes-vous sûr de vouloir ajouter cet événement à votre calendrier ?"
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
    <div className="py-24 min-h-screen p-4 relative">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div
          onClick={() => navigate("/")}
          className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl"
        >
          <TbChevronLeft className="text-3xl text-primary-darker" />
        </div>

        <div className="relative">
          <img
            className="rounded-2xl h-[400px] object-cover mx-auto my-4"
            src={`${BASE_URL}${evt.image}`}
          />
          <div className="absolute top-4 right-5 bg-gray-200/60 backdrop-blur-md h-10 w-10 rounded-lg flex-center">
            <FaBookmark
              onClick={AddEventToCalendar}
              className="text-primary-darker text-xl"
            />
          </div>
        </div>

        <h1 className="text-xl font-semibold">{evt.title}</h1>

        <div className="my-1 p-4 flex flex-col gap-y-3">
          <div className="flex items-center gap-x-4">
            <div className="bg-white p-2 rounded-lg">
              <FaCalendarAlt className="text-primary-darker" />
            </div>
            <div className="text-sm">
              <p>{formatDate(evt.start_date)}</p>
              <p>{formatDate(evt.end_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <div className="bg-white p-2 rounded-lg">
              <FaLocationDot className="text-primary-darker" />
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
            <div className="ml-auto btn-white text-sm">+ Suivre</div>
          </div>
        </div>
        <div className="mb-6 px-4">
          <p className="font-bold mb-2">Tags</p>
          {evt.categories && (
            <div>
              {evt.categories.map((cat) => (
                <span key={cat.category_id} className="mr-2 text-[10px] tag">
                  <span className="">{cat.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Accordion for Description */}
        <div className="mb-6 p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between text-left border-b pb-2 border-gray-400"
          >
            <span className="">Description</span>
            <TbChevronDown
              className={` text-2xl transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen && (
            <div className="mt-6 text-sm text-gray-700">{evt.description}</div>
          )}
        </div>
        <div className="flex justify-center">
          <button className="bg-primary-darker text-white py-2 px-3 rounded-xl text-sm">
            à {evt.price} €
          </button>
        </div>
        {/* Horizontal scroll of all events */}
        <div className="mt-10 px-4">
          <h2 className="text-sm   mb-1">En fonction de vos intêrets</h2>
          <div className="flex space-x-4 overflow-x-scroll pb-4">
            {events.map((e) => (
              <EventHomeCard key={e.event_id} event={e} baseUrl={BASE_URL} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
