// src/pages/CreateEvent.tsx
import { useNavigate } from "react-router-dom";
import CreateEventForm from "../components/CreateEventForm";

export default function CreateEvent() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <CreateEventForm
        onSuccess={() => navigate("/account")}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
