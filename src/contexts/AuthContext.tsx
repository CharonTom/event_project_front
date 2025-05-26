// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import type { AuthContextType } from "../types/types";

// On initialise le contexte à `undefined` pour forcer le check dans useAuth()
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // On récupère le token (string | null)
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // Setter typé
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
  };

  // Sync avec axios & localStorage
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Mémoisation du contexte
  const contextValue = useMemo<AuthContextType>(
    () => ({ token, setToken }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook pour consommer le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
