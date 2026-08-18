import {
  HomeIcon,
  MapIcon,
  RouteIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import type { Tab } from '../types/setu';

const items: { id: Tab | 'crowd'; label: string; Icon: typeof HomeIcon; action?: 'crowd' }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'journey', label: 'Journey', Icon: RouteIcon },
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'crowd', label: 'Crowd', Icon: UsersIcon, action: 'crowd' },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
];

export function BottomNav() {
  const { tab, setTab, closeOverlay, openOverlay } = useSetu();

  function handleNav(id: Tab | 'crowd', action?: 'crowd') {
    closeOverlay();
    if (action === 'crowd') {
      openOverlay('crowd');
      return;
    }
    setTab(id as Tab);
  }

  return (
    <nav
      aria-label="Primary"
      className="shrink-0 w-full bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-[0_-4px_16px_rgba(16,42,67,0.06)] px-1 pt-1"
    >
      <ul className="flex w-full">
        {items.map(({ id, label, Icon, action }) => {
          const active = tab === id;
          return (
            <li key={id} className="flex-1 min-w-0">
              <button
                onClick={() => handleNav(id, action)}
                aria-current={active ? 'page' : undefined}
                className={`
                  relative tap w-full min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition-all duration-150
                  ${active ? 'text-navy' : 'text-muted hover:text-navy/70'}
                `}
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-amber"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`flex items-center justify-center w-8 h-7 rounded-lg transition-colors duration-150 ${
                    active ? 'bg-navy/8' : ''
                  }`}
                >
                  <Icon className="w-[20px] h-[20px] shrink-0" strokeWidth={active ? 2.2 : 1.7} />
                </span>
                <span className={`txt-xs max-w-full truncate ${active ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
