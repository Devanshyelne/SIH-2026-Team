import React from 'react';
import { TrainFrontIcon, TriangleAlertIcon, WifiIcon, XIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
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

function StatusBar({ dark }: {dark: boolean;}) {
  return (
    <div
      className={`shrink-0 h-9 px-5 flex items-center justify-between txt-xs font-medium ${
      dark ? 'bg-navy-dark text-white' : 'bg-white text-navy'}`
      }>
      
      <Mono>08:34</Mono>
      <div className="flex items-center gap-1.5">
        <WifiIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
        <Mono>82%</Mono>
      </div>
    </div>);

}

function Screens() {
  const { tab } = useSetu();
  if (tab === 'journey') return <Journey />;
  if (tab === 'map') return <MapScreen />;
  if (tab === 'coach') return <CoachFinder />;
  if (tab === 'profile') return <Profile />;
  return <Home />;
}

function Overlays() {
  const { overlay } = useSetu();
  if (!overlay) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-canvas">
      {overlay === 'findMe' && <FindMe />}
      {overlay === 'more' && <FindMe title="All facilities" />}
      {overlay === 'exits' && <ExitFinder />}
      {overlay === 'crowd' && <LiveCrowd />}
      {overlay === 'medical' && <Medical />}
    </div>);

}

function PlatformChangeSheet() {
  const { platformAlertOpen, dismissPlatformAlert, acceptNewPlatformRoute } = useSetu();
  if (!platformAlertOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <button
        className="absolute inset-0 bg-navy-dark/45"
        aria-label="Dismiss platform change"
        onClick={dismissPlatformAlert} />
      
      <div
        role="alertdialog"
        aria-labelledby="pc-title"
        className="relative w-full bg-white rounded-t-2xl p-4">
        
        <div className="flex items-start gap-2.5">
          <TriangleAlertIcon className="w-6 h-6 text-[#8a5b00] shrink-0" strokeWidth={2.2} />
          <div className="flex-1">
            <h2
              id="pc-title"
              className="font-display font-semibold txt-lg text-navy uppercase tracking-wide">
              
              Platform change
            </h2>
            <p className="txt-sm text-muted">Mumbai Central → Thane · 08:42</p>
          </div>
          <button
            onClick={dismissPlatformAlert}
            aria-label="Close"
            className="tap w-9 flex items-center justify-center text-muted">
            
            <XIcon className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-lg bg-[#FDF3DC] p-3">
          <Mono className="txt-2xl font-semibold text-muted line-through">5</Mono>
          <span className="txt-lg text-[#8a5b00]" aria-hidden="true">
            →
          </span>
          <Mono className="txt-2xl font-semibold text-navy">7</Mono>
          <p className="txt-sm text-navy flex-1">
            Your train is now departing from Platform 7.
          </p>
        </div>

        <div className="mt-3">
          <p className="txt-xs uppercase tracking-wider text-muted">New shortest route</p>
          <p className="txt-base text-navy">
            <Mono className="font-semibold">3 min</Mono> via the Main Foot Over Bridge
          </p>
        </div>

        <Button full className="mt-3" onClick={acceptNewPlatformRoute}>
          Show new route
        </Button>
        <p className="txt-xs text-muted text-center mt-2">
          Voice: “Attention. Your train platform has changed to Platform 7.”
        </p>
      </div>
    </div>);

}

function CoachNearbySheet() {
  const { coachNearby, dismissCoachNearby, selectedCoach, setTab } = useSetu();
  if (!coachNearby) return null;
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 p-3">
      <div className="bg-navy text-white rounded-xl p-3.5 shadow-lg">
        <p className="txt-xs uppercase tracking-wider text-white/60">Your coach is nearby</p>
        <p className="font-display font-semibold txt-base mt-0.5">
          Coach <Mono>{selectedCoach}</Mono> · <Mono>70</Mono> m · <Mono>1</Mono> min
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={dismissCoachNearby}
            className="tap rounded-lg border border-white/30 txt-sm font-semibold">
            
            Not now
          </button>
          <button
            onClick={() => {
              dismissCoachNearby();
              setTab('coach');
            }}
            className="tap rounded-lg bg-amber text-navy-dark txt-sm font-semibold">
            
            Find my coach
          </button>
        </div>
      </div>
    </div>);

}

function EmergencyStrip() {
  const { emergency, setTab, openOverlay } = useSetu();
  if (!emergency) return null;
  return (
    <button
      onClick={() => {
        openOverlay(null);
        setTab('map');
      }}
      className="shrink-0 w-full bg-setu-red text-white px-4 py-2 flex items-center gap-2 text-left">
      
      <TriangleAlertIcon className="w-4 h-4 shrink-0" strokeWidth={2.2} />
      <span className="txt-xs font-semibold flex-1">
        Emergency route update · high crowd near Platform 5
      </span>
      <span className="txt-xs underline">View routes</span>
    </button>);

}

function DesktopPanel() {
  const {
    started,
    a11y,
    triggerPlatformChange,
    festival,
    setFestival,
    emergency,
    setEmergency,
    showCoachNearby,
    reset
  } = useSetu();

  return (
    <aside className="hidden lg:flex flex-col w-[340px] shrink-0 text-white">
      <div className="flex items-center gap-2.5">
        <span
          className="w-9 h-9 rounded-lg bg-amber flex items-center justify-center"
          aria-hidden="true">
          
          <TrainFrontIcon className="w-5 h-5 text-navy-dark" strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-display font-bold text-xl leading-none">SETU</p>
          <p className="text-[11px] tracking-[0.16em] text-amber font-medium mt-1">
            SMART STATION NAVIGATOR
          </p>
        </div>
      </div>
      <p className="text-white/70 text-sm mt-5 leading-relaxed">
        Navigate the station. Find your way. Travel smarter. Indoor navigation, live crowd
        and passenger assistance for Dadar Railway Station, Mumbai.
      </p>

      <div className="mt-8 border-t border-white/10 pt-5">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/50">
          Prototype conditions
        </p>
        <div className="mt-3 space-y-2">
          <button
            disabled={!started}
            onClick={triggerPlatformChange}
            className="w-full text-left rounded-lg border border-white/15 px-3 py-2.5 text-sm hover:bg-white/5 disabled:opacity-40">
            
            Platform change 5 → 7
          </button>
          <button
            disabled={!started}
            onClick={() => setFestival(!festival)}
            className="w-full text-left rounded-lg border border-white/15 px-3 py-2.5 text-sm hover:bg-white/5 disabled:opacity-40">
            
            {festival ? 'Clear' : 'Trigger'} Ganpati festival crowd
          </button>
          <button
            disabled={!started}
            onClick={() => setEmergency(!emergency)}
            className="w-full text-left rounded-lg border border-white/15 px-3 py-2.5 text-sm hover:bg-white/5 disabled:opacity-40">
            
            {emergency ? 'Clear' : 'Trigger'} emergency congestion
          </button>
          <button
            disabled={!started}
            onClick={showCoachNearby}
            className="w-full text-left rounded-lg border border-white/15 px-3 py-2.5 text-sm hover:bg-white/5 disabled:opacity-40">
            
            Coach nearby prompt
          </button>
          <button
            onClick={reset}
            className="w-full text-left rounded-lg border border-white/15 px-3 py-2.5 text-sm hover:bg-white/5">
            
            Restart from mode selection
          </button>
        </div>
        <p className="text-xs text-white/45 mt-4">
          Current mode: {started ? a11y ? 'Accessibility Mode' : 'Normal Mode' : 'Not started'}
        </p>
      </div>
    </aside>);

}

export function SetuShell() {
  const { started, a11y, tab } = useSetu();

  return (
    <div className="w-full min-h-full bg-navy-dark flex items-center justify-center gap-14 px-6 py-8">
      <DesktopPanel />

      <div
        className={`${a11y ? 'setu-a11y' : ''} relative w-[390px] max-w-full h-[844px] max-h-[92vh] bg-canvas rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10 flex flex-col`}>
        
        <StatusBar dark={!started} />
        {started && <EmergencyStrip />}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {!started ?
          <ModeSelect /> :

          <>
              <Screens />
              <Overlays />
              {tab !== 'coach' && <CoachNearbySheet />}
              <PlatformChangeSheet />
            </>
          }
        </div>
        {started && <BottomNav />}
      </div>
    </div>);

}