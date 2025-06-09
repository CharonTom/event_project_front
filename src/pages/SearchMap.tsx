import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import TodayBanner from "../assets/today-banner.png";

// Centre de la carte
const lyonCenter: [number, number] = [45.764, 4.8357];

// Tes adresses
const eventsStatic = [
  {
    id: 1,
    address: "1 place du change, 69002 Lyon",
    price: 32,
    title: "Concert Jazz",
  },
  {
    id: 2,
    address: "12 Rue de la République, 69002 Lyon",
    price: 45,
    title: "Exposition Photo",
  },
  {
    id: 3,
    address: "3 Rue de la Barre, 69002 Lyon",
    price: 20,
    title: "Atelier Cuisine",
  },
];

// Badge prix cliquable
const createPriceIcon = (price: number) =>
  L.divIcon({
    className: "leaflet-interactive border-none bg-transparent",
    html: `<div class="bg-primary text-white px-2 py-1 rounded-md font-bold">${price}€</div>`,
    iconSize: [null, null],
    popupAnchor: [0, -10],
  });

export default function SearchMap() {
  const [events, setEvents] = useState<
    Array<{
      id: number;
      lat: number;
      lng: number;
      price: number;
      title: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<null | (typeof events)[0]>(
    null
  );

  // Géocodage
  useEffect(() => {
    (async () => {
      const geo: typeof events = [];
      for (let evt of eventsStatic) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            evt.address
          )}`
        );
        const data = await res.json();
        if (data[0]) {
          geo.push({
            id: evt.id,
            lat: +data[0].lat,
            lng: +data[0].lon,
            price: evt.price,
            title: evt.title,
          });
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      setEvents(geo);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Chargement…</span>
      </div>
    );

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={lyonCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {events.map((evt) => (
          <Marker
            key={evt.id}
            position={[evt.lat, evt.lng]}
            icon={createPriceIcon(evt.price)}
            eventHandlers={{
              click: () => setSelectedEvent(evt),
            }}
          />
        ))}
      </MapContainer>

      {/* Carte de détail en bas */}
      {selectedEvent && (
        <div className="fixed bottom-20 w-[90%]  right-[5%] bg-white shadow-lg  z-10 h-1/4 overflow-auto rounded-2xl">
          <div className="flex h-full">
            <img
              src={TodayBanner}
              alt={selectedEvent.title}
              className="h-full w-[40%] object-cover  mb-2 bg-gray-100"
            />
            <div className="p-4 w-[60%]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                <span className="">{selectedEvent.price} €</span>
              </p>
            </div>
          </div>

          {/* ajoute ici image, adresse, description… */}
        </div>
      )}
    </div>
  );
}
