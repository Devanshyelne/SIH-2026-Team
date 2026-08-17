import { TriangleAlertIcon, XIcon } from "lucide-react";
import { useSetu } from "../contexts/SetuContext";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Button, Mono } from "./ui";
import { ModeSelect } from "../pages/ModeSelect";
import { Home } from "../pages/Home";
import { Journey } from "../pages/Journey";
import { MapScreen } from "../pages/MapScreen";
import { CoachFinder } from "../pages/CoachFinder";
import { Profile } from "../pages/Profile";
import { FindMe } from "../pages/FindMe";
import { ExitFinder } from "../pages/ExitFinder";
import { LiveCrowd } from "../pages/LiveCrowd";
import { Medical } from "../pages/Medical";
import { Chatbot } from "./Chatbot";

/* -------------------------------------------------------------------------- */
/* Screens                                                                    */
/* -------------------------------------------------------------------------- */

function Screens() {
  const { tab } = useSetu();

  const content = (() => {
    switch (tab) {
      case "journey":
        return <Journey />;

      case "map":
        return <MapScreen />;

      case "coach":
        return <CoachFinder />;

      case "profile":
        return <Profile />;

      case "home":
      default:
        return <Home />;
    }
  })();

  /*
   * Map needs the entire available viewport.
   * Other pages are kept inside a readable responsive column.
   */
  if (tab === "map") {
    return (
      <div className="relative w-full h-full min-w-0 min-h-0 overflow-hidden">
        {content}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl h-full min-w-0 min-h-0 overflow-x-hidden overflow-y-auto no-scrollbar">
      {content}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Overlays                                                                   */
/* -------------------------------------------------------------------------- */

function Overlays() {
  const { overlay, closeOverlay } = useSetu();

  if (!overlay) return null;

  const panel = (() => {
    switch (overlay) {
      case "findMe":
        return <FindMe />;

      case "more":
        return <FindMe title="All facilities" />;

      case "exits":
        return <ExitFinder />;

      case "crowd":
        return <LiveCrowd />;

      case "medical":
        return <Medical />;

      default:
        return null;
    }
  })();

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-navy-dark/45"
        aria-label="Close panel"
        onClick={closeOverlay}
      />

      {/* Panel */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-full
          sm:max-w-md
          h-full
          max-h-[100dvh]
          bg-canvas
          shadow-2xl
          overflow-hidden
          flex
          flex-col
        "
      >
        {panel}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Platform Change Sheet                                                      */
/* -------------------------------------------------------------------------- */

function PlatformChangeSheet() {
  const {
    platformAlertOpen,
    dismissPlatformAlert,
    acceptNewPlatformRoute,
  } = useSetu();

  if (!platformAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-navy-dark/45"
        aria-label="Dismiss platform change"
        onClick={dismissPlatformAlert}
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-labelledby="pc-title"
        aria-modal="true"
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white
          rounded-2xl
          p-4
          sm:p-5
          shadow-2xl
          max-h-[92dvh]
          overflow-y-auto
          overscroll-contain
        "
      >
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <TriangleAlertIcon
            className="w-6 h-6 text-[#8a5b00] shrink-0"
            strokeWidth={2.2}
          />

          <div className="flex-1 min-w-0">
            <h2
              id="pc-title"
              className="
                font-display
                font-semibold
                txt-lg
                text-navy
                uppercase
                tracking-wide
              "
            >
              Platform change
            </h2>

            <p className="txt-sm text-muted">
              Mumbai Central → Thane · 08:42
            </p>
          </div>

          <button
            type="button"
            onClick={dismissPlatformAlert}
            aria-label="Close"
            className="
              tap
              w-9
              h-9
              shrink-0
              flex
              items-center
              justify-center
              rounded-lg
              text-muted
              hover:bg-slate-100
            "
          >
            <XIcon className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Platform change */}
        <div className="mt-3 flex items-center gap-2 sm:gap-3 rounded-lg bg-[#FDF3DC] p-3">
          <Mono className="txt-2xl font-semibold text-muted line-through">
            5
          </Mono>

          <span
            className="txt-lg text-[#8a5b00] shrink-0"
            aria-hidden="true"
          >
            →
          </span>

          <Mono className="txt-2xl font-semibold text-navy">
            7
          </Mono>

          <p className="txt-sm text-navy flex-1 min-w-0">
            Your train is now departing from Platform 7.
          </p>
        </div>

        {/* Route */}
        <div className="mt-3">
          <p className="txt-xs uppercase tracking-wider text-muted">
            New shortest route
          </p>

          <p className="txt-base text-navy">
            <Mono className="font-semibold">3 min</Mono> via the Main Foot
            Over Bridge
          </p>
        </div>

        {/* Action */}
        <Button
          full
          className="mt-3"
          onClick={acceptNewPlatformRoute}
        >
          Show new route
        </Button>

        <p className="txt-xs text-muted text-center mt-2">
          Voice: “Attention. Your train platform has changed to Platform 7.”
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Coach Nearby Sheet                                                         */
/* -------------------------------------------------------------------------- */

function CoachNearbySheet() {
  const {
    coachNearby,
    dismissCoachNearby,
    selectedCoach,
    setTab,
    tab,
  } = useSetu();

  if (!coachNearby || tab === "coach") {
    return null;
  }

  return (
    <div
      className="
        fixed
        left-3
        right-3
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
        sm:left-auto
        sm:right-6
        sm:bottom-6
        z-40
        sm:w-full
        sm:max-w-sm
      "
    >
      <div className="bg-navy text-white rounded-xl p-3.5 shadow-2xl">
        <p className="txt-xs uppercase tracking-wider text-white/60">
          Your coach is nearby
        </p>

        <p className="font-display font-semibold txt-base mt-0.5">
          Coach <Mono>{selectedCoach}</Mono> · <Mono>70</Mono> m ·{" "}
          <Mono>1</Mono> min
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={dismissCoachNearby}
            className="
              tap
              rounded-lg
              border
              border-white/30
              txt-sm
              font-semibold
              hover:bg-white/10
            "
          >
            Not now
          </button>

          <button
            type="button"
            onClick={() => {
              dismissCoachNearby();
              setTab("coach");
            }}
            className="
              tap
              rounded-lg
              bg-amber
              text-navy-dark
              txt-sm
              font-semibold
              hover:brightness-95
            "
          >
            Find my coach
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Emergency Strip                                                            */
/* -------------------------------------------------------------------------- */

function EmergencyStrip() {
  const { emergency, setTab, openOverlay } = useSetu();

  if (!emergency) return null;

  return (
    <button
      type="button"
      onClick={() => {
        openOverlay(null);
        setTab("map");
      }}
      className="
        shrink-0
        w-full
        bg-setu-red
        text-white
        px-3
        sm:px-4
        py-2
        flex
        items-center
        gap-2
        text-left
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          w-full
          flex
          items-center
          gap-2
          min-w-0
        "
      >
        <TriangleAlertIcon
          className="w-4 h-4 shrink-0"
          strokeWidth={2.2}
        />

        <span className="txt-xs font-semibold flex-1 min-w-0">
          Emergency route update · high crowd near Platform 5
        </span>

        <span className="txt-xs underline shrink-0">
          View routes
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Main SETU Shell                                                            */
/* -------------------------------------------------------------------------- */

export function SetuShell() {
  const { started, a11y } = useSetu();

  return (
    <div
      className={`
        ${a11y ? "setu-a11y" : ""}
        w-full
        min-w-0
        h-[100dvh]
        min-h-[100dvh]
        overflow-hidden
        flex
        flex-col
        bg-canvas
      `}
    >
      {/* Top navigation */}
      <Navbar />

      {/* Emergency notification */}
      {started && <EmergencyStrip />}

      {/* Main content */}
      <main
        className={`
          relative
          flex-1
          min-h-0
          min-w-0
          ${
            started
              ? "overflow-hidden"
              : "overflow-y-auto overflow-x-hidden no-scrollbar"
          }
        `}
      >
        {!started ? (
          <div className="mx-auto w-full max-w-4xl min-w-0">
            <ModeSelect />
          </div>
        ) : (
          <>
            <Screens />

            {/* Floating chatbot */}
            <Chatbot />

            {/* Side drawer */}
            <Overlays />

            {/* Coach notification */}
            <CoachNearbySheet />

            {/* Platform change modal */}
            <PlatformChangeSheet />
          </>
        )}
      </main>

      {/* Mobile navigation */}
      {started && (
        <div className="md:hidden shrink-0 pb-[env(safe-area-inset-bottom)]">
          <BottomNav />
        </div>
      )}
    </div>
  );
}