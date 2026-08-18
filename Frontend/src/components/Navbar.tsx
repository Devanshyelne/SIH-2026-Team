import React from 'react';
import {
  AccessibilityIcon,
  ChevronDownIcon,
  MenuIcon,
  TrainFrontIcon,
  HomeIcon,
  MapIcon,
  RouteIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import type { Tab } from '../types/setu';

const items: { id: Tab; label: string; shortLabel: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', Icon: HomeIcon },
  { id: 'journey', label: 'Journey', shortLabel: 'Journey', Icon: RouteIcon },
  { id: 'map', label: 'Map', shortLabel: 'Map', Icon: MapIcon },
  { id: 'coach', label: 'Coach Finder', shortLabel: 'Coach', Icon: TrainFrontIcon },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', Icon: UserIcon },
];

export function Navbar() {
  const {
    tab,
    setTab,
    closeOverlay,
    a11y,
    mode,
    setMode,
    started,
    triggerPlatformChange,
    festival,
    setFestival,
    emergency,
    setEmergency,
    showCoachNearby,
    reset,
  } = useSetu();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [tab]);

  function navigate(id: Tab) {
    closeOverlay();
    setTab(id);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 glass-nav text-white shadow-nav">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[60px] flex items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => {
            closeOverlay();
            if (started) setTab('home');
          }}
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="SETU home"
        >
          <span
            className="w-9 h-9 rounded-xl bg-amber flex items-center justify-center shrink-0 shadow-soft transition-transform duration-150 group-hover:scale-105"
            aria-hidden="true"
          >
            <TrainFrontIcon className="w-5 h-5 text-navy-dark" strokeWidth={2.2} />
          </span>
          <span className="leading-tight text-left">
            <span className="block font-display font-bold text-lg tracking-tight">SETU</span>
            <span className="hidden sm:block text-[10px] tracking-[0.14em] text-amber/90 font-medium">
              SMART STATION NAVIGATOR
            </span>
          </span>
        </button>

        {/* Desktop navigation */}
        {started && (
          <nav aria-label="Primary" className="hidden lg:flex items-center justify-center gap-0.5 flex-1">
            {items.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`
                    relative tap inline-flex items-center gap-2 rounded-xl px-4 py-2 txt-sm font-semibold whitespace-nowrap transition-all duration-150
                    ${active ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-white/8'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {started && (
            <button
              type="button"
              onClick={() => setMode(mode === 'accessibility' ? 'normal' : 'accessibility')}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 txt-xs font-semibold transition-colors duration-150"
              aria-label="Toggle accessibility mode"
            >
              <AccessibilityIcon className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="hidden xl:inline">
                {a11y ? 'Accessibility' : 'Normal'}
              </span>
            </button>
          )}

          {started && (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="tap inline-flex items-center gap-1 rounded-xl px-3 py-2 txt-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                Demo
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-navy shadow-elevated border hairline overflow-hidden z-40 animate-slide-up"
                  role="menu"
                >
                  {[
                    { label: 'Platform change 5 → 7', action: () => { triggerPlatformChange(); setMenuOpen(false); } },
                    { label: `${festival ? 'Clear' : 'Trigger'} festival crowd`, action: () => { setFestival(!festival); setMenuOpen(false); } },
                    { label: `${emergency ? 'Clear' : 'Trigger'} emergency`, action: () => { setEmergency(!emergency); setMenuOpen(false); } },
                    { label: 'Coach nearby prompt', action: () => { showCoachNearby(); setMenuOpen(false); } },
                  ].map((item) => (
                    <button
                      key={item.label}
                      role="menuitem"
                      onClick={item.action}
                      className="w-full text-left px-4 py-3 txt-sm hover:bg-slate-50 border-b hairline transition-colors duration-150"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    role="menuitem"
                    onClick={() => { reset(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 txt-sm hover:bg-red-50 text-setu-red font-medium"
                  >
                    Restart SETU
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          {started && (
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden tap w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors duration-150"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <XIcon className="w-5 h-5" strokeWidth={2} />
              ) : (
                <MenuIcon className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {started && mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-navy-800/95 backdrop-blur-sm animate-slide-up">
          <nav aria-label="Mobile" className="px-4 py-3 space-y-1">
            {items.map(({ id, label, Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold transition-colors duration-150 ${
                    active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/8'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setMode(mode === 'accessibility' ? 'normal' : 'accessibility')}
              className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold text-white/70 hover:bg-white/8"
            >
              <AccessibilityIcon className="w-5 h-5" strokeWidth={2} />
              Switch to {mode === 'accessibility' ? 'Normal' : 'Accessibility'} Mode
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
