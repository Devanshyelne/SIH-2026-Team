
import { SetuProvider } from "./contexts/SetuContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SetuShell } from "./components/SetuShell";

export function App() {
  return (
    <AuthProvider>
      <SetuProvider>
        <SetuShell />
      </SetuProvider>
    </AuthProvider>
  );
}