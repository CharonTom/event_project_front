import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import type { JWTPayload, UserProfile } from "../types/types";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

function Setting() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get<UserProfile>(
        `${BASE_URL}/users/${payload.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Erreur ${err.response?.status} lors du chargement du profil.`
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [token, fetchProfile]);

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleEdit = () => {
    navigate("/setting/edit");
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    )
      return;

    try {
      await axios.delete(`${BASE_URL}/users/${user?.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/logout", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la suppression du compte."
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-around bg-amber-200">
        <div>Profil pic</div>
        <div className="">
          <div>Name Lastname</div>
          <div>Email</div>
          <div>phone</div>
        </div>
      </div>
      <div>
        <p onClick={handleEdit}>Modifier le profil</p>
        <div>Préférences d'événements</div>
        <div>Notifications</div>
        <div>FAQ</div>
        <div>Contactez-nous</div>
        <p onClick={handleLogout}>Se déconncter</p>
      </div>

      <p onClick={handleDelete}>Supprimer mon compte</p>
      <div>conditions d'utilisations</div>
      <div>Politique de confidentialité</div>
    </div>
  );
}

export default Setting;
