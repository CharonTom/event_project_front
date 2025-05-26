// src/components/CreateEventForm.tsx
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { Category, CEFProps } from "../types/types";

export default function CreateEventForm({ onSuccess, onCancel }: CEFProps) {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // Charge les catégories disponibles
  useEffect(() => {
    axios
      .get<Category[]>(`${BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) =>
        console.error("Impossible de charger les catégories", err)
      );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Construction du FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("location", location);
    formData.append("city", city);
    formData.append("price", price.toString());
    selectedCats.forEach((catId) => {
      formData.append("category_id", catId.toString());
    });
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.post(`${BASE_URL}/events`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Ne pas fixer manuellement content-type ici
        },
      });
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la création de l'événement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Créer un événement</h2>

      {error && <p className="text-red-600">{error}</p>}

      {/* Titre */}
      <div>
        <label className="block font-medium">Titre</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date de début</label>
          <input
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Date de fin</label>
          <input
            type="datetime-local"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Lieu et Ville */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Lieu</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium">Ville</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Prix */}
      <div>
        <label className="block font-medium">Prix (€)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-32 border rounded px-2 py-1"
        />
      </div>

      {/* Catégories */}
      <div>
        <label className="block font-medium">Catégories</label>
        <select
          multiple
          required
          value={selectedCats.map(String)}
          onChange={(e) =>
            setSelectedCats(
              Array.from(e.target.selectedOptions, (o) => +o.value)
            )
          }
          className="w-full border rounded px-2 py-1"
        >
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload d'image */}
      <div>
        <label className="block font-medium">Image de l'événement</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="w-full"
        />
      </div>

      {/* Boutons */}
      <div className="flex space-x-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {loading ? "Création..." : "Créer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
