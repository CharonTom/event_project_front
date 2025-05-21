// src/contexts/EventContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface Category {
  category_id: number;
  name: string;
  parent?: {
    category_id: number;
    name: string;
  };
}

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
  categories?: Category[];

  // à faire évoluer
}

// Type du contexte : un tableau d’Event.
interface EventContextType {
  events: Event[];
}

// Création du contexte avec une valeur par défaut typée.
export const EventContext = createContext<EventContextType>({ events: [] });
const BASE_URL = import.meta.env.VITE_SERVER_URL;

// 5. Composant provider typé.
export const EventProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // 6. On précise à axios le type de la réponse.
    axios
      .get<Event[]>(`${BASE_URL}/events`)
      .then((response) => setEvents(response.data))
      .catch((err) =>
        console.error("Erreur lors du fetch des événements :", err)
      );
  }, []);

  return (
    <EventContext.Provider value={{ events }}>{children}</EventContext.Provider>
  );
};
