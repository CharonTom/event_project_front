import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Logout: React.FC = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    navigate("/login", { replace: true });
  }, [setToken, navigate]);

  return <p>Déconnexion en cours…</p>;
};

export default Logout;
