import { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Event as EventType, Category } from "../types/types";
import { EventContext } from "../contexts/EventContext";
import { Link } from "react-router-dom";

// Centre de la carte sur Lyon
const lyonCenter: [number, number] = [45.764, 4.8357];

// Création du badge prix cliquable
const createPriceIcon = (price: number) =>
  L.divIcon({
    className: "leaflet-interactive border-none bg-transparent",
    html: `<div class="bg-primary-lighter text-white px-2 py-1 rounded-md font-bold">${price}€</div>`,
    // @ts-expect-error can't put null without error
    iconSize: [null, null],
    popupAnchor: [0, -10],
  });

interface MarkerData {
  id: number;
  event_id: number;
  lat: number;
  lng: number;
  price: number;
  title: string;
  address: string;
  image?: string;
  categories?: Category[];
}

export default function SearchMap() {
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const { events: eventsFromContext } = useContext(EventContext);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MarkerData | null>(null);

  useEffect(() => {
    if (!eventsFromContext || eventsFromContext.length === 0) return;

    (async () => {
      setLoading(true);
      const geoResults: MarkerData[] = [];

      for (const evt of eventsFromContext as EventType[]) {
        const fullAddress = `${evt.location}, ${evt.city}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
              fullAddress
            )}`
          );
          const data = await res.json();
          if (data?.[0]?.lat && data?.[0]?.lon) {
            geoResults.push({
              id: evt.event_id,
              event_id: evt.event_id,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              price: parseFloat(evt.price) || 0,
              title: evt.title,
              address: fullAddress,
              image: evt.image,
              categories: evt.categories,
            });
          } else {
            console.warn(`Aucune coordonnée trouvée pour ${fullAddress}`);
          }
        } catch (error) {
          console.error(`Erreur géocodage pour ${fullAddress}:`, error);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }

      setMarkers(geoResults);
      setLoading(false);
    })();
  }, [eventsFromContext]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Chargement…</span>
      </div>
    );
  }

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
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createPriceIcon(m.price)}
            eventHandlers={{ click: () => setSelected(m) }}
          />
        ))}
      </MapContainer>

      {selected && (
        <Link to={`/details/${selected.event_id}`}>
          <div className="fixed bottom-20 h-1/4 w-[90%] right-[5%] bg-white shadow-lg z-10 max-h-1/2 overflow-auto rounded-2xl">
            <div className="flex h-full">
              <img
                src={`${BASE_URL}${selected.image}`}
                alt={selected.title}
                className="h-full w-[40%] object-cover mb-2 bg-gray-100 rounded-l-2xl"
              />
              <div className="p-4 w-[60%] flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="">{selected.title}</h2>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelected(null);
                    }}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-1">{selected.address}</p>
                <p className="text-xs text-gray-600 mb-2">{selected.price} €</p>
                {selected.categories && (
                  <div className="flex gap-x-2">
                    {selected.categories.map((cat) => (
                      <span
                        key={cat.category_id}
                        className="tag text-[10px] p-1"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
