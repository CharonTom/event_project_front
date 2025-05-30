import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { Category, CEFProps } from "../types/types";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function CreateEventForm({ onSuccess, onCancel }: CEFProps) {
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
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

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
        },
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

  // Classes utilitaires communes pour les champs sans bordure noire
  const inputClasses =
    "w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg";

  return (
    <section className="py-24 min-h-screen relative text-sm">
      <div className="mx-auto w-full max-w-2xl p-2">
        <div
          onClick={() => navigate("/account")}
          className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
        >
          <TbChevronLeft className="text-3xl text-primary-darker" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Information de base</h2>

          {error && <p className="text-red-600">{error}</p>}

          {/* Titre */}
          <div>
            <label className="block mb-1">Titre de l'évènement</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1">Description de l'évènement</label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Catégories */}
          <div>
            <label className="block mb-1">Catégories</label>
            <select
              multiple
              required
              value={selectedCats.map(String)}
              onChange={(e) =>
                setSelectedCats(
                  Array.from(e.target.selectedOptions, (o) => +o.value)
                )
              }
              className={inputClasses}
            >
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold">Date et lieu</h2>

          {/* Dates */}
          <div>
            <label className="block mb-1">Date et heure de début</label>
            <input
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block mb-1">Date et heure de fin</label>
            <input
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Lieu et Ville */}
          <div>
            <label className="block mb-1">Adresse</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block mb-1">Ville</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Prix */}
          <h2 className="text-xl font-semibold">Tarifs & Billets</h2>

          <div>
            <label className="block mb-1">Prix du billet</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className={inputClasses}
            />
          </div>

          {/* Upload d'image */}
          <h2 className="text-xl font-semibold">Médias</h2>
          <div className="flex items-center">
            {/* Bouton personnalisé pour ouvrir le sélecteur de fichier */}
            <label htmlFor="file-upload" className="btn-primary py-2">
              Parcourir…
            </label>
            {/* Affichage du nom du fichier ou d’un texte par défaut */}
            <span className="text-gray-700 bg-primary-input p-2 w-full rounded-lg">
              {file ? file.name : "Aucun fichier sélectionné"}
            </span>
            {/* Input natif masqué */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          {/* Boutons */}
          <div className="flex space-x-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2"
            >
              {loading ? "Création..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
