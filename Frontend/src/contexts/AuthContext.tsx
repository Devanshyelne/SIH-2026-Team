import React, {
  createContext,
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

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;

  login: (
    identifier: string,
    password: string,
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;

  isAuthenticated: boolean;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("setu_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser(token)
      .then((response) => {
        if (
          response.success &&
          response.user
        ) {
          setUser(response.user);
        } else {
          localStorage.removeItem(
            "setu_token",
          );
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(
          "setu_token",
        );

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(
    identifier: string,
    password: string,
  ) {
    const response = await loginUser(
      identifier.trim(),
      password,
    );

    if (
      !response.success ||
      !response.token ||
      !response.user
    ) {
      throw new Error(
        response.message ||
          "Login failed",
      );
    }

    localStorage.setItem(
      "setu_token",
      response.token,
    );

    setUser(response.user);
  }

  async function register(
    username: string,
    email: string,
    password: string,
  ) {
    const response =
      await registerUser(
        username.trim(),
        email.trim().toLowerCase(),
        password,
      );

    if (
      !response.success ||
      !response.token ||
      !response.user
    ) {
      throw new Error(
        response.message ||
          "Registration failed",
      );
    }

    localStorage.setItem(
      "setu_token",
      response.token,
    );

    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem(
      "setu_token",
    );

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}