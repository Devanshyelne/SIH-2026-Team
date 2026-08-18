import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onRegister: () => void;
  onSuccess: () => void;
}

export function Login({
  onRegister,
  onSuccess,
}: LoginProps) {
  const { login } = useAuth();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError("");

    if (!identifier.trim()) {
      setError(
        "Please enter your username or email",
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password",
      );
      return;
    }

    setLoading(true);

    try {
      await login(
        identifier,
        password,
      );

      onSuccess();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-elevated p-6 sm:p-8">

          <h1 className="text-2xl font-bold text-navy">
            Welcome to SETU
          </h1>

          <p className="text-muted mt-1">
            Login to your account
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            <div>
              <label className="block text-sm font-medium mb-1">
                Username or Email
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(
                    e.target.value,
                  )
                }
                required
                autoComplete="username"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value,
                  )
                }
                required
                autoComplete="current-password"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy text-white py-3 font-semibold disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          <p className="text-sm text-center mt-6 text-muted">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={onRegister}
              className="text-navy font-semibold"
            >
              Create account
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}