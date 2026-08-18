import { SetuProvider } from './contexts/SetuContext';
import { SetuShell } from './components/SetuShell';

export function App() {
  return (
    <SetuProvider>
      <SetuShell />
    </SetuProvider>);

}