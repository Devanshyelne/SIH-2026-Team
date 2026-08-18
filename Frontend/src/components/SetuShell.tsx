import { TriangleAlertIcon, XIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Button, Mono } from './ui';
import { ModeSelect } from '../pages/ModeSelect';
import { Home } from '../pages/Home';
import { Journey } from '../pages/Journey';
import { MapScreen } from '../pages/MapScreen';
import { CoachFinder } from '../pages/CoachFinder';
import { Profile } from '../pages/Profile';
import { FindMe } from '../pages/FindMe';
import { ExitFinder } from '../pages/ExitFinder';
import { LiveCrowd } from '../pages/LiveCrowd';
import { Medical } from '../pages/Medical';
import { Chatbot } from './Chatbot';

function Screens() {
  const { tab } = useSetu();

  const content = (() => {
    switch (tab) {
      case 'journey':
        return <Journey />;
      case 'map':
        return <MapScreen />;
      case 'coach':
        return <CoachFinder />;
      case 'profile':
        return <Profile />;
      case 'home':
      default:
        return <Home />;
    }
  })();

  if (tab === 'map') {
    return (
      <div className="relative w-full h-full min-w-0 min-h-0 overflow-hidden">{content}</div>
    );
  }

  if (tab === 'home') {
    return (
      <div className="w-full h-full min-w-0 min-h-0 overflow-x-hidden overflow-y-auto no-scrollbar">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-x-hidden overflow-y-auto no-scrollbar">
      {content}
    </div>
  );
}

function Overlays() {
  const { overlay, closeOverlay } = useSetu();
  if (!overlay) return null;

  const panel = (() => {
    switch (overlay) {
      case 'findMe':
        return <FindMe />;
      case 'more':
        return <FindMe title="All facilities" />;
      case 'exits':
        return <ExitFinder />;
      case 'crowd':
        return <LiveCrowd />;
      case 'medical':
        return <Medical />;
      default:
        return null;
    }
  })();

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-navy-dark/50 backdrop-blur-[2px] animate-fade-in"
        aria-label="Close panel"
        onClick={closeOverlay}
      />
      <div
        className="
          relative z-10 w-full max-w-full sm:max-w-lg lg:max-w-xl h-full max-h-[100dvh]
          bg-canvas shadow-elevated overflow-hidden flex flex-col
          animate-slide-in-right
        "
      >
        {panel}
      </div>
    </div>
  );
}

function PlatformChangeSheet() {
  const { platformAlertOpen, dismissPlatformAlert, acceptNewPlatformRoute } = useSetu();
  if (!platformAlertOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-navy-dark/50 backdrop-blur-[2px]"
        aria-label="Dismiss platform change"
        onClick={dismissPlatformAlert}
      />
      <div
        role="alertdialog"
        aria-labelledby="pc-title"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-white rounded-2xl p-5 shadow-elevated max-h-[92dvh] overflow-y-auto overscroll-contain animate-slide-up"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <TriangleAlertIcon className="w-5 h-5 text-[#8a5b00]" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="pc-title" className="font-display font-semibold txt-lg text-navy">
              Platform change
            </h2>
            <p className="txt-sm text-muted">Mumbai Central → Thane · 08:42</p>
          </div>
          <button
            type="button"
            onClick={dismissPlatformAlert}
            aria-label="Close"
            className="tap w-9 h-9 shrink-0 flex items-center justify-center rounded-xl text-muted hover:bg-slate-100"
          >
            <XIcon className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-100 p-4">
          <Mono className="txt-2xl font-semibold text-muted line-through">5</Mono>
          <span className="txt-lg text-[#8a5b00]" aria-hidden="true">→</span>
          <Mono className="txt-2xl font-semibold text-navy">7</Mono>
          <p className="txt-sm text-navy flex-1">Your train is now departing from Platform 7.</p>
        </div>

        <div className="mt-4">
          <p className="txt-xs uppercase tracking-wider text-muted font-medium">New shortest route</p>
          <p className="txt-base text-navy mt-0.5">
            <Mono className="font-semibold">3 min</Mono> via the Main Foot Over Bridge
          </p>
        </div>

        <Button full className="mt-4" onClick={acceptNewPlatformRoute}>
          Show new route
        </Button>
      </div>
    </div>
  );
}

function CoachNearbySheet() {
  const { coachNearby, dismissCoachNearby, selectedCoach, setTab, tab } = useSetu();
  if (!coachNearby || tab === 'coach') return null;

  return (
    <div className="fixed left-3 right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-sm animate-slide-up">
      <div className="gradient-hero text-white rounded-2xl p-4 shadow-elevated border border-white/10">
        <p className="txt-xs uppercase tracking-wider text-white/60 font-medium">Your coach is nearby</p>
        <p className="font-display font-semibold txt-base mt-1">
          Coach <Mono>{selectedCoach}</Mono> · <Mono>70</Mono> m · <Mono>1</Mono> min
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={dismissCoachNearby}
            className="tap rounded-xl border border-white/25 txt-sm font-semibold hover:bg-white/10"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => { dismissCoachNearby(); setTab('coach'); }}
            className="tap rounded-xl bg-amber text-navy-dark txt-sm font-semibold hover:brightness-95"
          >
            Find my coach
          </button>
        </div>
      </div>
    </div>
  );
}

function EmergencyStrip() {
  const { emergency, setTab, openOverlay } = useSetu();
  if (!emergency) return null;

  return (
    <button
      type="button"
      onClick={() => { openOverlay(null); setTab('map'); }}
      className="shrink-0 w-full bg-setu-red text-white px-4 py-2.5 flex items-center gap-2 text-left hover:bg-[#c03d3d] transition-colors duration-150"
    >
      <div className="mx-auto max-w-7xl w-full flex items-center gap-2 min-w-0">
        <TriangleAlertIcon className="w-4 h-4 shrink-0 animate-pulse-soft" strokeWidth={2.2} />
        <span className="txt-xs font-semibold flex-1">
          Emergency route update · high crowd near Platform 5
        </span>
        <span className="txt-xs underline shrink-0 font-medium">View routes</span>
      </div>
    </button>
  );
}

export function SetuShell() {
  const { started, a11y } = useSetu();

  return (
    <div
      className={`${a11y ? 'setu-a11y' : ''} w-full min-w-0 h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col bg-canvas`}
    >
      <Navbar />
      {started && <EmergencyStrip />}

      <main
        className={`relative flex-1 min-h-0 min-w-0 ${
          started ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden no-scrollbar'
        }`}
      >
        {!started ? <ModeSelect /> : (
          <>
            <Screens />
            <Chatbot />
            <Overlays />
            <CoachNearbySheet />
            <PlatformChangeSheet />
          </>
        )}
      </main>

      {started && (
        <div className="lg:hidden shrink-0 pb-[env(safe-area-inset-bottom)]">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
