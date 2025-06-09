import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Coordonnées de Lyon comme tuple [latitude, longitude]
const lyonCenter: [number, number] = [45.764, 4.8357];

// Exemple de liste d'événements avec adresses
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

// Création d'une icône personnalisée affichant le prix avec Tailwind CSS
const createPriceIcon = (price: number) =>
  L.divIcon({
    className: "", // supprime le style par défaut
    html: `<div class=\"bg-primary text-white px-2 py-1 rounded-md font-bold shadow\">${price}€</div>`,
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

  useEffect(() => {
    async function geocodeAll() {
      const geocoded: Array<{
        id: number;
        lat: number;
        lng: number;
        price: number;
        title: string;
      }> = [];
      for (let evt of eventsStatic) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
              evt.address
            )}`
          );
          const data = await res.json();
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            geocoded.push({
              id: evt.id,
              lat,
              lng,
              price: evt.price,
              title: evt.title,
            });
          }
        } catch (err) {
          console.error("Échec géocodage :", err);
        }
        // petite pause pour respecter les quotas
        await new Promise((r) => setTimeout(r, 1000));
      }
      setEvents(geocoded);
      setLoading(false);
    }
    geocodeAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Chargement des événements...</span>
      </div>
    );
  }

  return (
    <div className="z-0 h-screen w-full">
      <MapContainer
        center={lyonCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {events.map((evt) => (
          <Marker
            key={evt.id}
            position={[evt.lat, evt.lng]}
            icon={createPriceIcon(evt.price)}
          >
            <Popup>
              <div className="bg-secondary">
                <h3 className="text-lgfont-semibold">{evt.title}</h3>
                <p className="mt-1">
                  <strong>{evt.price} €</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
