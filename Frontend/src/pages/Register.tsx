import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface RegisterProps {
  onLogin: () => void;
  onSuccess: () => void;
}

export function Register({
  onLogin,
  onSuccess,
}: RegisterProps) {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        username,
        email,
        password,
      );

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed",
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
            Create your SETU account
          </h1>

          <p className="text-muted mt-1">
            Register to continue
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
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                minLength={3}
                maxLength={30}
                required
                className="w-full border rounded-xl px-4 py-3"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full border rounded-xl px-4 py-3"
                placeholder="Enter your email"
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
                  setPassword(e.target.value)
                }
                minLength={6}
                required
                className="w-full border rounded-xl px-4 py-3"
                placeholder="Minimum 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-navy text-white py-3 font-semibold disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted">
            Already have an account?{" "}
            <button
              onClick={onLogin}
              className="text-navy font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}