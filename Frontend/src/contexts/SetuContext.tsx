import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type { MapLayer, Mode, NavTarget, Overlay, Tab } from '../types/setu';
import { alternateRoute, platformRoute } from '../data/station';

interface NavState {
  target: NavTarget | null;
  active: boolean;
  stepIndex: number;
  voice: boolean;
  paused: boolean;
  usingAlternate: boolean;
}

interface SetuValue {
  mode: Mode;
  a11y: boolean;
  started: boolean;
  tab: Tab;
  overlay: Overlay;
  platform: string;
  platformChanged: boolean;
  platformAlertOpen: boolean;
  festival: boolean;
  emergency: boolean;
  medical: boolean;
  coachClass: string;
  selectedCoach: string;
  coachNearby: boolean;
  layers: Record<MapLayer, boolean>;
  nav: NavState;
  setMode: (m: Mode) => void;
  start: () => void;
  reset: () => void;
  setTab: (t: Tab) => void;
  openOverlay: (o: Overlay) => void;
  closeOverlay: () => void;
  triggerPlatformChange: () => void;
  dismissPlatformAlert: () => void;
  acceptNewPlatformRoute: () => void;
  setFestival: (v: boolean) => void;
  setEmergency: (v: boolean) => void;
  setMedical: (v: boolean) => void;
  setCoachClass: (c: string) => void;
  selectCoach: (id: string) => void;
  showCoachNearby: () => void;
  dismissCoachNearby: () => void;
  toggleLayer: (l: MapLayer) => void;
  navigateTo: (t: NavTarget) => void;
  startNavigation: () => void;
  endNavigation: () => void;
  nextStep: () => void;
  repeatStep: () => void;
  togglePause: () => void;
  toggleVoice: () => void;
  takeAlternate: () => void;
}

const SetuContext = createContext<SetuValue | null>(null);

export function useSetu(): SetuValue {
  const ctx = useContext(SetuContext);
  if (!ctx) throw new Error('useSetu must be used inside SetuProvider');
  return ctx;
}

export function SetuProvider({ children }: {children: React.ReactNode;}) {
  const [mode, setModeState] = useState<Mode>('normal');
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [platform, setPlatform] = useState('5');
  const [platformChanged, setPlatformChanged] = useState(false);
  const [platformAlertOpen, setPlatformAlertOpen] = useState(false);
  const [festival, setFestival] = useState(true);
  const [emergency, setEmergency] = useState(false);
  const [medical, setMedical] = useState(false);
  const [coachClass, setCoachClass] = useState('Second Class');
  const [selectedCoach, setSelectedCoach] = useState('D3');
  const [coachNearby, setCoachNearby] = useState(false);
  const [layers, setLayers] = useState<Record<MapLayer, boolean>>({
    facilities: true,
    crowd: false,
    accessibility: false,
    exits: true,
    transport: false
  });
  const [nav, setNav] = useState<NavState>({
    target: null,
    active: false,
    stepIndex: 0,
    voice: false,
    paused: false,
    usingAlternate: false
  });

  const a11y = mode === 'accessibility';

  // Accessibility Mode prioritises accessible routing layers.
  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    setLayers((l) => ({ ...l, accessibility: m === 'accessibility' }));
  }, []);

  const start = useCallback(() => {
    setStarted(true);
    setTab('home');
  }, []);

  const reset = useCallback(() => {
    setStarted(false);
    setTab('home');
    setOverlay(null);
    setPlatform('5');
    setPlatformChanged(false);
    setPlatformAlertOpen(false);
    setFestival(true);
    setEmergency(false);
    setMedical(false);
    setCoachClass('Second Class');
    setSelectedCoach('D3');
    setCoachNearby(false);
    setNav({
      target: null,
      active: false,
      stepIndex: 0,
      voice: false,
      paused: false,
      usingAlternate: false
    });
  }, []);

  const triggerPlatformChange = useCallback(() => {
    setPlatform('7');
    setPlatformChanged(true);
    setPlatformAlertOpen(true);
  }, []);

  const navigateTo = useCallback(
    (target: NavTarget) => {
      setNav({
        target,
        active: false,
        stepIndex: 0,
        voice: a11y,
        paused: false,
        usingAlternate: false
      });
      setOverlay(null);
      setTab('map');
    },
    [a11y]
  );

  const acceptNewPlatformRoute = useCallback(() => {
    setPlatformAlertOpen(false);
    navigateTo(platformRoute('7', a11y));
  }, [a11y, navigateTo]);

  const startNavigation = useCallback(() => {
    setNav((n) => ({ ...n, active: true, paused: false, voice: true, stepIndex: 0 }));
  }, []);

  const endNavigation = useCallback(() => {
    setNav((n) => ({ ...n, active: false, voice: false, paused: false, stepIndex: 0 }));
  }, []);

  const nextStep = useCallback(() => {
    setNav((n) => {
      if (!n.target) return n;
      const last = n.target.steps.length - 1;
      return { ...n, stepIndex: Math.min(n.stepIndex + 1, last) };
    });
  }, []);

  const takeAlternate = useCallback(() => {
    setNav((n) => ({
      ...n,
      target: alternateRoute,
      usingAlternate: true,
      stepIndex: 0
    }));
    setTab('map');
  }, []);

  // Auto-advance the walking instruction while navigation is running.
  useEffect(() => {
    if (!nav.active || nav.paused || !nav.target) return;
    const last = nav.target.steps.length - 1;
    if (nav.stepIndex >= last) return;
    const t = window.setTimeout(() => {
      setNav((n) => ({ ...n, stepIndex: Math.min(n.stepIndex + 1, last) }));
    }, 5200);
    return () => window.clearTimeout(t);
  }, [nav.active, nav.paused, nav.stepIndex, nav.target]);

  // Coach proximity prompt appears once the passenger is on the platform.
  useEffect(() => {
    if (!nav.active || !nav.target) return;
    if (!nav.target.id.startsWith('platform')) return;
    if (nav.stepIndex < nav.target.steps.length - 1) return;
    const t = window.setTimeout(() => setCoachNearby(true), 1800);
    return () => window.clearTimeout(t);
  }, [nav.active, nav.stepIndex, nav.target]);

  const value = useMemo<SetuValue>(
    () => ({
      mode,
      a11y,
      started,
      tab,
      overlay,
      platform,
      platformChanged,
      platformAlertOpen,
      festival,
      emergency,
      medical,
      coachClass,
      selectedCoach,
      coachNearby,
      layers,
      nav,
      setMode,
      start,
      reset,
      setTab,
      openOverlay: setOverlay,
      closeOverlay: () => setOverlay(null),
      triggerPlatformChange,
      dismissPlatformAlert: () => setPlatformAlertOpen(false),
      acceptNewPlatformRoute,
      setFestival,
      setEmergency,
      setMedical,
      setCoachClass,
      selectCoach: setSelectedCoach,
      showCoachNearby: () => setCoachNearby(true),
      dismissCoachNearby: () => setCoachNearby(false),
      toggleLayer: (l) => setLayers((s) => ({ ...s, [l]: !s[l] })),
      navigateTo,
      startNavigation,
      endNavigation,
      nextStep,
      repeatStep: () => setNav((n) => ({ ...n })),
      togglePause: () => setNav((n) => ({ ...n, paused: !n.paused })),
      toggleVoice: () => setNav((n) => ({ ...n, voice: !n.voice })),
      takeAlternate
    }),
    [
    mode,
    a11y,
    started,
    tab,
    overlay,
    platform,
    platformChanged,
    platformAlertOpen,
    festival,
    emergency,
    medical,
    coachClass,
    selectedCoach,
    coachNearby,
    layers,
    nav,
    setMode,
    start,
    reset,
    triggerPlatformChange,
    acceptNewPlatformRoute,
    navigateTo,
    startNavigation,
    endNavigation,
    nextStep,
    takeAlternate]

  );

  return <SetuContext.Provider value={value}>{children}</SetuContext.Provider>;
}