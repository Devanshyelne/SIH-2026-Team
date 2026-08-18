import { useState, useEffect } from "react";
import {
  LockIcon,
  MailIcon,
  TrainFrontIcon,
  UserIcon,
  UserPlusIcon,
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

interface RegisterProps {
  onLogin: () => void;
  onSuccess: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register({ onLogin, onSuccess }: RegisterProps) {
  const { register, isAuthenticated, closeAuthPage } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  function validate() {
    const next: Record<string, string> = {};

    if (username.trim().length < 3) {
      next.username = "Username must be at least 3 characters";
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Please enter a valid email address";
    }

    if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
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
      await register(username, email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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

      <div className="flex-1 flex items-start sm:items-center justify-center p-4 -mt-6 pb-8">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-elevated">
          <h1 className="font-display font-bold text-2xl text-navy">Create your account</h1>
          <p className="txt-sm text-muted mt-1">
            Join SETU for personalised station navigation at Dadar
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 txt-sm text-setu-red" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <FormField
              label="Username"
              htmlFor="register-username"
              error={fieldErrors.username}
              hint="3–30 characters"
            >
              <Input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={30}
                autoComplete="username"
                placeholder="Choose a username"
                icon={<UserIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Email"
              htmlFor="register-email"
              error={fieldErrors.email}
            >
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                icon={<MailIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="register-password"
              error={fieldErrors.password}
              hint="At least 6 characters"
            >
              <PasswordInput
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                placeholder="Create a password"
                icon={<LockIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Confirm password"
              htmlFor="register-confirm"
              error={fieldErrors.confirmPassword}
            >
              <PasswordInput
                id="register-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
                placeholder="Confirm your password"
                icon={<LockIcon className="w-4 h-4" strokeWidth={2} />}
                disabled={loading}
              />
            </FormField>

            <Button type="submit" full size="lg" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-4 h-4" strokeWidth={2} />
                  Create account
                </>
              )}
            </Button>
          </form>

          <p className="txt-sm text-center mt-6 text-muted">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLogin}
              className="font-semibold text-teal hover:underline underline-offset-2"
            >
              Sign in
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
