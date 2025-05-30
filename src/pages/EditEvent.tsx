import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EventForm from "../components/EventForm";
import type { EventFormType } from "../types/types";

export default function EditEvent() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<EventFormType> | null>(
    null
  );
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (!token || !id) return;
    axios
      .get(`${BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        // ajuster les dates au format datetime-local
        const toLocal = (iso: string) =>
          new Date(
            new Date(iso).getTime() - new Date(iso).getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16);
        setInitialData({
          ...data,
          start_date: toLocal(data.start_date),
          end_date: toLocal(data.end_date),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          category_id: data.categories.map((c: any) => c.category_id),
        });
      });
  }, [token, id]);

  const handleUpdate = async (formData: FormData) => {
    await axios.patch(`${BASE_URL}/events/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/account");
  };

  const handleDelete = async () => {
    if (window.confirm("Confirmez la suppression ?")) {
      await axios.delete(`${BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/account");
    }
  };

  if (!initialData) return <div>Chargement…</div>;

  return (
    <EventForm
      initialData={initialData}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/account")}
      onDelete={handleDelete}
      submitLabel="Editer"
    />
  );
}
