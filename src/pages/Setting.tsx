import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import type { JWTPayload, UserProfile } from "../types/types";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

function Setting() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utility to capitalize a name
  const capitalize = (str: string = ""): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Utility to get user initials
  const getInitials = (first?: string | null, last?: string | null): string => {
    const f = first ? first.charAt(0).toUpperCase() : "";
    const l = last ? last.charAt(0).toUpperCase() : "";
    return `${f}${l}`;
  };

  const fetchProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token as string);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <section className="py-24 min-h-screen relative">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div
          onClick={() => navigate("/")}
          className="flex-center absolute top-8 left-8 bg-white h-12 w-12 rounded-xl"
        >
          <TbChevronLeft className="text-3xl text-primary-darker" />
        </div>

        <div className="my-4 flex items-center justify-around">
          <div className="text-white text-3xl bg-primary rounded-full h-20 w-20 flex-center font-bold">
            {getInitials(user?.first_name, user?.last_name)}
          </div>
          <div className="text-center">
            <div className="font-semibold text-xl">
              {capitalize(user?.first_name)} {capitalize(user?.last_name)}
            </div>
            <div>{user?.email}</div>
            <div>{user?.phone}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="my-6 flex items-center justify-between">
            <p onClick={handleEdit}>Modifier le profil</p>
            <TbChevronRight className="text-2xl" />
          </div>

          <div className="my-6 flex items-center justify-between">
            <p>Préférences d'événements</p>
            <TbChevronRight className="text-2xl" />
          </div>
          <div className="my-6 flex items-center justify-between">
            <p>Notifications</p>
            <TbChevronRight className="text-2xl" />
          </div>
          <div className="my-6 flex items-center justify-between">
            <p>FAQ</p>
            <TbChevronRight className="text-2xl" />
          </div>
          <div className="my-6 flex items-center justify-between">
            <p>Contactez-nous</p>
            <TbChevronRight className="text-2xl" />
          </div>
          <div className="mt-6 mb-4 flex items-center justify-between">
            <p onClick={handleLogout}>Se déconnecter</p>
            <TbChevronRight className="text-2xl" />
          </div>
        </div>

        <div className="text-center text-primary">
          <p className="text-red-500 mb-4" onClick={handleDelete}>
            Supprimer mon compte
          </p>
          <p className="mb-2">conditions d'utilisations</p>
          <p className="mb-2 text-gray-500 font-semibold">---</p>
          <p className="mb-2">Politique de confidentialité</p>
        </div>
      </div>
    </section>
  );
}

export default Setting;
