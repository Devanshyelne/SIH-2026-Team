import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SetuProvider } from "./contexts/SetuContext";
import { SetuShell } from "./components/SetuShell";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { LoadingSpinner } from "./components/ui";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white font-display font-bold text-xl shadow-elevated">
          S
        </div>
        <p className="mt-4 font-display font-semibold text-navy">SETU</p>
        <div className="mt-3 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
        <p className="text-muted mt-2 txt-sm">Restoring your session…</p>
      </div>
    </div>
  );
}

function AppRouter() {
  const { loading, authPage, showLogin, showRegister, closeAuthPage } =
    useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (authPage === "login") {
    return (
      <Login
        onRegister={showRegister}
        onSuccess={closeAuthPage}
      />
    );
  }

  if (authPage === "register") {
    return (
      <Register
        onLogin={showLogin}
        onSuccess={closeAuthPage}
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
      <AppRouter />
    </AuthProvider>
  );
}
