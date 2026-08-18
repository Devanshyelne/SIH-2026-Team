import { useState } from "react";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SetuProvider } from "./contexts/SetuContext";
import { SetuShell } from "./components/SetuShell";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function AuthenticationGate() {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-navy">
            SETU
          </div>

          <p className="text-muted mt-2">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onLogin={() =>
            setShowRegister(false)
          }
          onSuccess={() =>
            setShowRegister(false)
          }
        />
      );
    }

    return (
      <Login
        onRegister={() =>
          setShowRegister(true)
        }
        onSuccess={() => {}}
      />
    );
  }

  return (
    <SetuProvider>
      <SetuShell />
    </SetuProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AuthenticationGate />
    </AuthProvider>
  );
}