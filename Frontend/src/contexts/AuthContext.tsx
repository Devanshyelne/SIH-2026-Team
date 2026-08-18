import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
} from "../services/api";

export type AuthPage = "login" | "register" | null;

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authPage: AuthPage;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  showLogin: () => void;
  showRegister: () => void;
  closeAuthPage: () => void;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "setu_token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authPage, setAuthPage] = useState<AuthPage>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser(token)
      .then((response) => {
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showLogin = useCallback(() => setAuthPage("login"), []);
  const showRegister = useCallback(() => setAuthPage("register"), []);
  const closeAuthPage = useCallback(() => setAuthPage(null), []);

  async function login(identifier: string, password: string) {
    const response = await loginUser(identifier.trim(), password);

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || "Login failed");
    }

    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
    setAuthPage(null);
  }

  async function register(
    username: string,
    email: string,
    password: string,
  ) {
    const response = await registerUser(
      username.trim(),
      email.trim().toLowerCase(),
      password,
    );

    if (!response.success || !response.token || !response.user) {
      throw new Error(response.message || "Registration failed");
    }

    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
    setAuthPage(null);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setAuthPage(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authPage,
        login,
        register,
        logout,
        showLogin,
        showRegister,
        closeAuthPage,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
