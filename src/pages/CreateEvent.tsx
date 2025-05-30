import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EventForm from "../components/EventForm";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const handleCreate = async (formData: FormData) => {
    await axios.post(`${BASE_URL}/events`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/account");
  };

  return (
    <EventForm
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
      submitLabel="Ajouter"
    />
  );
}
