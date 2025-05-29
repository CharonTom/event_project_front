// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { AuthContextType, JWTPayload } from "../types/types";

// On initialise le contexte à `undefined` pour forcer le check dans useAuth()
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // On récupère le token (string | null)
  const [token, setTokenState] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // Setter typé et stable
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
  }, []);

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

  // Vérification d'expiration du JWT au chargement et à chaque changement
  useEffect(() => {
    if (!token) return;
    try {
      const { exp } = jwtDecode<JWTPayload>(token);
      if (Date.now() >= exp * 1000) {
        // Token expiré : on nettoie et on redirige
        setToken(null);
        window.location.href = "/login";
      }
    } catch {
      // Si le token n'est pas un JWT valide
      setToken(null);
      window.location.href = "/login";
    }
  }, [token, setToken]);

  // Intercepteur Axios pour gérer les 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setToken(null);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setToken]);

  // Mémoisation du contexte
  const contextValue = useMemo<AuthContextType>(
    () => ({ token, setToken }),
    [token, setToken]
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
