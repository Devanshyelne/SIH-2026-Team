import React from 'react';
import {
  AccessibilityIcon,
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  TrainFrontIcon,
  HomeIcon,
  MapIcon,
  RouteIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSetu } from '../contexts/SetuContext';
import type { Tab } from '../types/setu';

const items: { id: Tab; label: string; shortLabel: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', Icon: HomeIcon },
  { id: 'journey', label: 'Journey', shortLabel: 'Journey', Icon: RouteIcon },
  { id: 'map', label: 'Station Map', shortLabel: 'Map', Icon: MapIcon },
  { id: 'coach', label: 'Coach Finder', shortLabel: 'Coach', Icon: TrainFrontIcon },
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', Icon: UserIcon },
];

export function Navbar() {
  const {
    tab,
    setTab,
    closeOverlay,
    openOverlay,
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

  const {
    isAuthenticated,
    user,
    logout,
    showLogin,
    showRegister,
  } = useAuth();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    if (!menuOpen && !userMenuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen, userMenuOpen]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [tab]);

  function navigate(id: Tab) {
    closeOverlay();
    setTab(id);
    setMobileOpen(false);
  }

  function openCrowd() {
    closeOverlay();
    openOverlay('crowd');
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 bg-navy text-white shadow-nav border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 min-h-[64px] flex items-center justify-between gap-3">
        <button
          onClick={() => {
            closeOverlay();
            if (started) setTab('home');
          }}
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="SETU home"
        >
          <span
            className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center shrink-0 shadow-soft transition-transform duration-150 group-hover:scale-105"
            aria-hidden="true"
          >
            <TrainFrontIcon className="w-5 h-5 text-navy-dark" strokeWidth={2.2} />
          </span>
          <span className="leading-tight text-left hidden xs:block">
            <span className="block font-display font-bold text-lg tracking-tight">SETU</span>
            <span className="hidden sm:block text-[10px] tracking-[0.14em] text-amber/90 font-medium">
              SMART STATION NAVIGATOR
            </span>
          </span>
        </button>

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
                    relative tap inline-flex items-center gap-2 rounded-xl px-3.5 py-2 txt-sm font-semibold whitespace-nowrap transition-all duration-150
                    ${active ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white hover:bg-white/8'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  {label}
                </button>
              );
            })}
            <button
              onClick={openCrowd}
              className="tap inline-flex items-center gap-2 rounded-xl px-3.5 py-2 txt-sm font-semibold text-white/65 hover:text-white hover:bg-white/8 transition-all duration-150"
            >
              <UsersIcon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              Live Crowd
            </button>
          </nav>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {started && (
            <button
              type="button"
              onClick={() => setMode(mode === 'accessibility' ? 'normal' : 'accessibility')}
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 txt-xs font-semibold transition-colors duration-150"
              aria-label="Toggle accessibility mode"
            >
              <AccessibilityIcon className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="hidden xl:inline">{a11y ? 'Accessibility' : 'Normal'}</span>
            </button>
          )}

          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                className="tap inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 txt-sm font-semibold transition-colors duration-150"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber text-navy-dark font-bold txt-xs">
                  {user?.username?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                <span className="hidden lg:inline max-w-[120px] truncate">{user?.username}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-navy shadow-elevated border border-slate-200 overflow-hidden z-40 animate-slide-up"
                  role="menu"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="txt-sm font-semibold text-navy truncate">{user?.username}</p>
                    <p className="txt-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => { navigate('profile'); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 txt-sm hover:bg-slate-50 transition-colors duration-150 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" strokeWidth={2} />
                    Profile
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 txt-sm hover:bg-red-50 text-setu-red font-medium flex items-center gap-2"
                  >
                    <LogOutIcon className="w-4 h-4" strokeWidth={2} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={showLogin}
                className="tap inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 txt-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <LogInIcon className="w-4 h-4" strokeWidth={2} />
                Login
              </button>
              <button
                type="button"
                onClick={showRegister}
                className="tap inline-flex items-center gap-1.5 rounded-xl bg-amber text-navy-dark px-3 py-1.5 txt-sm font-bold hover:brightness-95 transition-all duration-150"
              >
                <UserPlusIcon className="w-4 h-4" strokeWidth={2} />
                Register
              </button>
            </div>
          )}

          {started && (
            <div className="relative hidden xl:block" ref={menuRef}>
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
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-navy shadow-elevated border border-slate-200 overflow-hidden z-40 animate-slide-up"
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
                      className="w-full text-left px-4 py-3 txt-sm hover:bg-slate-50 border-b border-slate-100 transition-colors duration-150"
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
              onClick={openCrowd}
              className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold text-white/70 hover:bg-white/8"
            >
              <UsersIcon className="w-5 h-5" strokeWidth={2} />
              Live Crowd
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === 'accessibility' ? 'normal' : 'accessibility')}
              className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold text-white/70 hover:bg-white/8"
            >
              <AccessibilityIcon className="w-5 h-5" strokeWidth={2} />
              Switch to {mode === 'accessibility' ? 'Normal' : 'Accessibility'} Mode
            </button>
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => { showLogin(); setMobileOpen(false); }}
                  className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold text-white/70 hover:bg-white/8"
                >
                  <LogInIcon className="w-5 h-5" strokeWidth={2} />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { showRegister(); setMobileOpen(false); }}
                  className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold bg-amber/20 text-amber"
                >
                  <UserPlusIcon className="w-5 h-5" strokeWidth={2} />
                  Register
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => { logout(); setMobileOpen(false); }}
                className="tap w-full flex items-center gap-3 rounded-xl px-4 py-3 txt-sm font-semibold text-red-300 hover:bg-white/8"
              >
                <LogOutIcon className="w-5 h-5" strokeWidth={2} />
                Logout ({user?.username})
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
