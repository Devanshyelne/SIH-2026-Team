import React from "react";
import {
  AccessibilityIcon,
  ChevronDownIcon,
  TrainFrontIcon,
  HomeIcon,
  MapIcon,
  RouteIcon,
  UserIcon,
} from "lucide-react";
import { useSetu } from "../contexts/SetuContext";
import type { Tab } from "../types/setu";

const items: {
  id: Tab;
  label: string;
  Icon: typeof HomeIcon;
}[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "journey", label: "Journey", Icon: RouteIcon },
  { id: "map", label: "Map", Icon: MapIcon },
  { id: "coach", label: "Coach", Icon: TrainFrontIcon },
  { id: "profile", label: "Profile", Icon: UserIcon },
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

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="relative shrink-0 z-30 bg-navy text-white border-b border-white/10">
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-3
          sm:px-4
          md:px-6
          min-h-16
          flex
          items-center
          justify-between
          gap-2
        "
      >
        {/* Brand */}
        <button
          onClick={() => {
            closeOverlay();

            if (started) {
              setTab("home");
            }
          }}
          className="flex items-center gap-2 shrink-0"
          aria-label="SETU home"
        >
          <span
            className="
              w-9
              h-9
              rounded-lg
              bg-amber
              flex
              items-center
              justify-center
              shrink-0
            "
            aria-hidden="true"
          >
            <TrainFrontIcon
              className="w-5 h-5 text-navy-dark"
              strokeWidth={2.2}
            />
          </span>

          <span className="leading-tight text-left">
            <span className="block font-display font-bold text-lg tracking-tight">
              SETU
            </span>

            <span className="hidden lg:block text-[10px] tracking-[0.16em] text-amber font-medium">
              SMART STATION NAVIGATOR
            </span>
          </span>
        </button>

        {/* Desktop navigation */}
        {started && (
          <nav
            aria-label="Primary"
            className="
              hidden
              md:flex
              items-center
              justify-center
              gap-0.5
              min-w-0
              flex-1
            "
          >
            {items.map(({ id, label, Icon }) => {
              const active = tab === id;

              return (
                <button
                  key={id}
                  onClick={() => {
                    closeOverlay();
                    setTab(id);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`
                    tap
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2
                    lg:px-3
                    txt-sm
                    font-semibold
                    whitespace-nowrap
                    transition-colors
                    duration-150
                    ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    strokeWidth={active ? 2.2 : 1.8}
                  />

                  <span className="hidden lg:inline">
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1.5 shrink-0">
          {started && (
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 txt-xs font-medium">
              {a11y ? (
                <>
                  <AccessibilityIcon
                    className="w-3.5 h-3.5"
                    strokeWidth={2}
                  />
                  Accessibility
                </>
              ) : (
                "Normal Mode"
              )}
            </span>
          )}

          {started && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="
                  tap
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  px-2
                  sm:px-3
                  txt-sm
                  font-semibold
                  text-white/80
                  hover:text-white
                  hover:bg-white/10
                  whitespace-nowrap
                "
              >
                <span className="hidden sm:inline">
                  Demo controls
                </span>

                <span className="sm:hidden">
                  Menu
                </span>

                <ChevronDownIcon
                  className="w-4 h-4"
                  strokeWidth={2}
                />
              </button>

              {menuOpen && (
                <>
                  <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />

                  <div
                    className="
                      absolute
                      right-0
                      mt-2
                      w-[min(18rem,calc(100vw-1rem))]
                      rounded-xl
                      bg-white
                      text-navy
                      shadow-xl
                      border
                      hairline
                      overflow-hidden
                      z-40
                    "
                  >
                    <button
                      onClick={() => {
                        setMode(
                          mode === "accessibility"
                            ? "normal"
                            : "accessibility"
                        );
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 border-b hairline"
                    >
                      Switch to{" "}
                      {mode === "accessibility"
                        ? "Normal"
                        : "Accessibility"}{" "}
                      Mode
                    </button>

                    <button
                      onClick={() => {
                        triggerPlatformChange();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 border-b hairline"
                    >
                      Platform change 5 → 7
                    </button>

                    <button
                      onClick={() => {
                        setFestival(!festival);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 border-b hairline"
                    >
                      {festival
                        ? "Clear"
                        : "Trigger"}{" "}
                      Ganpati festival crowd
                    </button>

                    <button
                      onClick={() => {
                        setEmergency(!emergency);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 border-b hairline"
                    >
                      {emergency
                        ? "Clear"
                        : "Trigger"}{" "}
                      emergency congestion
                    </button>

                    <button
                      onClick={() => {
                        showCoachNearby();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 border-b hairline"
                    >
                      Coach nearby prompt
                    </button>

                    <button
                      onClick={() => {
                        reset();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-3 txt-sm hover:bg-slate-50 text-setu-red"
                    >
                      Restart from mode selection
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}