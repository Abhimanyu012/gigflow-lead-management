import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials, RegisterData } from "../types/auth.types";
import { authApi } from "../api/auth.api";
import { useToastStore } from "../store/toastStore";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuth = (newUser: User, newToken: string) => {
    localStorage.setItem("token", newToken);
    setUser(newUser);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    setAuth(data.user, data.token);
    useToastStore.getState().addToast(`Welcome back, ${data.user.name}!`, "success");
  };

  const registerUser = async (userData: RegisterData) => {
    const data = await authApi.register(userData);
    setAuth(data.user, data.token);
    useToastStore.getState().addToast("Account created successfully!", "success");
  };

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const fetchedUser = await authApi.getMe();
          setAuth(fetchedUser, storedToken);
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, setAuth, logout, login, register: registerUser }}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] text-[var(--text)]">
          <div className="glass px-8 py-4 rounded-full text-[var(--text)] font-semibold shadow-xl animate-pulse">
            Loading GigFlow...
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
