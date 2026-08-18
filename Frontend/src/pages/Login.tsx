import { useState, useEffect } from "react";
import {
  LockIcon,
  LogInIcon,
  TrainFrontIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Card,
  FormField,
  Input,
  LoadingSpinner,
  PasswordInput,
} from "../components/ui";

interface LoginProps {
  onRegister: () => void;
  onSuccess: () => void;
}

export function Login({ onRegister, onSuccess }: LoginProps) {
  const { login, isAuthenticated, closeAuthPage } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  function validate() {
    const next: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      next.identifier = "Please enter your username or email";
    }

    if (!password) {
      next.password = "Please enter your password";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validate()) return;
    if (loading) return;

    setLoading(true);

    try {
      await login(identifier, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="bg-navy text-white px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber text-navy-dark shadow-soft">
            <TrainFrontIcon className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display font-bold text-2xl tracking-tight">SETU</p>
            <p className="text-xs tracking-[0.14em] text-amber/90 font-medium">
              SMART STATION NAVIGATOR
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start sm:items-center justify-center p-4 -mt-6">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-elevated">
          <h1 className="font-display font-bold text-2xl text-navy">Welcome back</h1>
          <p className="txt-sm text-muted mt-1">
            Sign in to save preferences and access your SETU profile
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 txt-sm text-setu-red" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <FormField
              label="Username or email"
              htmlFor="login-identifier"
              error={fieldErrors.identifier}
            >
              <Input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                placeholder="Enter username or email"
                icon={<UserIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="login-password"
              error={fieldErrors.password}
            >
              <PasswordInput
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                icon={<LockIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <Button type="submit" full size="lg" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogInIcon className="w-4 h-4" strokeWidth={2} />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <p className="txt-sm text-center mt-6 text-muted">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onRegister}
              className="font-semibold text-teal hover:underline underline-offset-2"
            >
              Create account
            </button>
          </p>

          <button
            type="button"
            onClick={closeAuthPage}
            className="mt-4 w-full txt-sm font-medium text-muted hover:text-navy transition-colors"
          >
            Continue without signing in →
          </button>
        </Card>
      </div>
    </div>
  );
}
