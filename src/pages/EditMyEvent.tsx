import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Category {
  category_id: number;
  name: string;
}

interface EventForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  price: number;
  category_id: number[];
  image?: File | null;
}

export default function EditMyEvent() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    city: "",
    price: 0,
    category_id: [],
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // Charger catégories
  useEffect(() => {
    axios
      .get<Category[]>(`${BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Erreur chargement catégories", err));
  }, []);

  // Charger l'événement
  useEffect(() => {
    if (!token || !id) return;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const date = new Date(data.start_date);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localStart = new Date(date.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);
        const endDate = new Date(data.end_date);
        const localEnd = new Date(endDate.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);

        setForm({
          title: data.title,
          description: data.description || "",
          start_date: localStart,
          end_date: localEnd,
          location: data.location || "",
          city: data.city || "",
          price: data.price || 0,
          category_id: data.categories?.map((c: any) => c.category_id) || [],
          image: null,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [token, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files, multiple, selectedOptions } = e.target as any;
    if (name === "image" && files) {
      setForm((f) => ({ ...f, image: files[0] }));
    } else if (name === "category_id" && multiple && selectedOptions) {
      const vals = Array.from(selectedOptions, (opt: any) => +opt.value);
      setForm((f) => ({ ...f, category_id: vals }));
    } else if (name === "price") {
      setForm((f) => ({ ...f, price: parseFloat(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("start_date", form.start_date);
    formData.append("end_date", form.end_date);
    formData.append("location", form.location);
    formData.append("city", form.city);
    formData.append("price", form.price.toString());
    form.category_id.forEach((cid) =>
      formData.append("category_id", cid.toString())
    );
    if (form.image) formData.append("image", form.image);

    try {
      await axios.patch(`${BASE_URL}/events/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Let browser set Content-Type
        },
      });
      navigate("/my-events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white shadow rounded-lg"
    >
      <h1 className="text-xl font-bold">Modifier l'événement</h1>

      <div>
        <label className="block font-medium">Titre</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Date de début</label>
          <input
            type="datetime-local"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Date de fin</label>
          <input
            type="datetime-local"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Lieu</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Ville</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Prix (€)</label>
        <input
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          className="w-32 border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Catégories</label>
        <select
          name="category_id"
          multiple
          value={form.category_id.map(String)}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Image de l'événement</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex space-x-4 pt-2 justify-end">
        <button
          type="button"
          onClick={() => navigate("/my-events")}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
