// src/components/CreateEventForm.tsx
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Category {
  category_id: number;
  name: string;
}

interface CreateEventDto {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  price: number;
  category_id: number[];
}

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateEventForm({ onSuccess, onCancel }: Props) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Récupère la liste des catégories
  // src/components/CreateEventForm.tsx
  useEffect(() => {
    axios
      .get<Category[]>("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) =>
        console.error("Impossible de charger les catégories", err)
      );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dto: CreateEventDto = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      location,
      city,
      price,
      category_id: selectedCats,
    };

    try {
      await axios.post("http://localhost:3000/events", dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
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

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

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
