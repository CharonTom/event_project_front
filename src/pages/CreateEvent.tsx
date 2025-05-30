// src/pages/CreateEvent.tsx
import { useNavigate } from "react-router-dom";
import CreateEventForm from "../components/CreateEventForm";

export default function CreateEvent() {
  const navigate = useNavigate();

  return (
    <div className="">
      <CreateEventForm
        onSuccess={() => navigate("/account")}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
