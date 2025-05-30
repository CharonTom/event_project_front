import React, { useState, useEffect, FormEvent } from "react";
import { TbChevronLeft } from "react-icons/tb";
import Select, { StylesConfig } from "react-select";
import axios from "axios";
import type { Category, EventFormType as EventFormType } from "../types/types";
import type { EventFormProps } from "../types/types";
import type { EventFormProps } from "../types/types";

export default function EventForm({
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = "Editer",
}: EventFormProps) {
  const [form, setForm] = useState<Partial<EventFormType>>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    city: "",
    price: 0,
    category_id: [],
    image: null,
    ...initialData,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    axios
      .get<Category[]>(`${BASE_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const styles: StylesConfig<{ value: number; label: string }, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#56d2d233",
      border: "none",
      boxShadow: "none",
      outline: "none",
      "&:hover": { border: "none" },
      "&:focus": { boxShadow: "none" },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#DBEAFE"
        : isFocused
        ? "#F3F4F6"
        : undefined,
      color: isSelected ? "#1E3A8A" : base.color,
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#F3F4F3",
      borderRadius: "5px",
    }),
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { name, value, files, selectedOptions, multiple } = e.target as any;
    if (name === "image" && files) {
      setForm((f) => ({ ...f, image: files[0] }));
    } else if (name === "category_id" && multiple) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vals = Array.from(selectedOptions, (opt: any) => +opt.value);
      setForm((f) => ({ ...f, category_id: vals }));
    } else if (name === "price") {
      setForm((f) => ({ ...f, price: parseFloat(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    [
      "title",
      "description",
      "start_date",
      "end_date",
      "location",
      "city",
    ].forEach((key) => {
      if (form[key as keyof typeof form])
        data.append(key, form[key as keyof typeof form] as string);
    });
    data.append("price", (form.price ?? 0).toString());
    (form.category_id ?? []).forEach((cid) =>
      data.append("category_id", cid.toString())
    );
    if (form.image) data.append("image", form.image as Blob);

    try {
      await onSubmit(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Erreur lors de l’opération.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 min-h-screen relative text-sm">
      <div className="mx-auto w-full max-w-2xl p-2">
        {onCancel && (
          <div
            onClick={onCancel}
            className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl cursor-pointer"
          >
            <TbChevronLeft className="text-3xl text-primary-darker" />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Information de base</h2>
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label className="block mb-1">Titre de l'évènement</label>
            <input
              name="title"
              type="text"
              required
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              rows={5}
              value={form.description || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block mb-1">Catégories</label>
            <Select
              isMulti
              name="category_id"
              options={categories.map((c) => ({
                value: c.category_id,
                label: c.name,
              }))}
              value={categories
                .filter((c) => form.category_id?.includes(c.category_id))
                .map((c) => ({ value: c.category_id, label: c.name }))}
              onChange={(opts) =>
                setForm((f) => ({
                  ...f,
                  category_id: opts.map((o) => o.value),
                }))
              }
              placeholder="Sélectionnez des catégories"
              styles={styles}
            />
          </div>

          <h2 className="text-xl font-semibold">Date et lieu</h2>

          <div>
            <label className="block mb-1">Date et heure de début</label>
            <input
              name="start_date"
              type="datetime-local"
              required
              value={form.start_date || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1">Date et heure de fin</label>
            <input
              name="end_date"
              type="datetime-local"
              required
              value={form.end_date || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block mb-1">Lieu</label>
            <input
              name="location"
              type="text"
              required
              value={form.location || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block mb-1">Ville</label>
            <input
              name="city"
              type="text"
              required
              value={form.city || ""}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <h2 className="text-xl font-semibold">Tarifs & Billets</h2>
          <div>
            <label className="block mb-1">Prix (€)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price ?? 0}
              onChange={handleChange}
              className="w-full border-none rounded px-2 py-2 bg-primary-input focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <h2 className="text-xl font-semibold">Médias</h2>
          <div className="flex items-center">
            <label htmlFor="image-upload" className="btn-white py-2 mr-2">
              Parcourir…
            </label>
            <span className="text-gray-700 bg-primary-input p-2 flex-1 rounded-lg">
              {form.image instanceof File
                ? form.image.name
                : "Aucun fichier sélectionné"}
            </span>
            <input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          <div className="flex space-x-4 pt-2 justify-between">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2"
            >
              {loading ? "Enregistrement..." : submitLabel}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="btn-white text-red-500"
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
