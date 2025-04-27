// src/pages/Account.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface CalendarEvent {
  calendar_event_id: number;
  added_at: string;
  wants_reminder: boolean;
  reminder_7d_sent: boolean;
  reminder_7d_sent_at: string | null;
  reminder_1d_sent: boolean;
  reminder_1d_sent_at: string | null;
  event: {
    event_id: number;
    title: string;
    description: string;
    start_date: string;
  };
}

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string | null;
  calendar: {
    calendar_id: number;
    events: CalendarEvent[];
  };
}

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function Account() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    const userId = payload.id;
    axios
      .get<UserProfile>(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("🪪 User reçu :", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            `Erreur ${err.response?.status} lors du chargement du profil.`
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleEdit = () => {
    navigate("/account/edit");
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      try {
        await axios.delete(`http://localhost:3000/users/${user?.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // redirige vers le composant Logout pour effacer le token et retourner à /login
        navigate("/logout", { replace: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la suppression du compte."
        );
      }
    }
  };

  const removeFromCalendar = async (eventId: number) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet événement de votre calendrier ?"
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:3000/users/${user?.user_id}/calendar/events/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la suppression de l'événement."
        );
      }
    }
  };

  if (loading) return <div>Chargement du profil…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      <h1 className="text-2xl font-bold">Mon profil</h1>
      <p>
        <span className="font-semibold">Nom :</span> {user.first_name}{" "}
        {user.last_name}
      </p>
      <p>
        <span className="font-semibold">Email :</span> {user.email}
      </p>
      <p>
        <span className="font-semibold">Téléphone :</span> {user.phone}
      </p>
      <p>
        <span className="font-semibold">Inscrit le :</span>{" "}
        {new Date(user.created_at).toLocaleDateString()}
      </p>
      {user.updated_at && (
        <p>
          <span className="font-semibold">Dernière mise à jour :</span>{" "}
          {new Date(user.updated_at).toLocaleDateString()}
        </p>
      )}

      {/* Boutons Modification & Suppression */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={handleEdit}
          className="flex-1 py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Modifier mes données
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-2 px-4 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Supprimer mon compte
        </button>
      </div>
      <section>
        <h2 className="text-xl font-semibold">Mon calendrier</h2>
        {user.calendar.events.length === 0 ? (
          <p>Aucun événement enregistré.</p>
        ) : (
          <ul className="space-y-4">
            {user.calendar.events.map((ce) => (
              <li key={ce.calendar_event_id} className="p-4 border rounded-lg">
                <p>
                  <span className="font-semibold">Titre :</span>{" "}
                  {ce.event.title}
                </p>
                <p>
                  <span className="font-semibold">Date :</span>{" "}
                  {new Date(ce.event.start_date).toLocaleString()}
                </p>

                {ce.wants_reminder && (
                  <p className="text-sm text-gray-600">Rappel activé</p>
                )}
                <button onClick={() => removeFromCalendar(ce.event.event_id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
