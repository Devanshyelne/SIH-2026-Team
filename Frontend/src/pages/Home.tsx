import React from 'react';

import {
  AccessibilityIcon,
  ArrowRightIcon,
  BotIcon,
  BrainIcon,
  ChevronDownIcon,
  DoorOpenIcon,
  HeartPulseIcon,
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  RouteIcon,
  ShieldIcon,
  SparklesIcon,
  TrainFrontIcon,
  TriangleAlertIcon,
  UsersIcon,
  WifiIcon,
} from 'lucide-react';

import { useSetu } from '../contexts/SetuContext';

import { AppFooter } from '../components/layout/AppFooter';
import {
  PageContainer,
  PageSection,
} from '../components/layout/PageContainer';

import {
  QuickLinkTile,
  ServiceTile,
} from '../components/layout/ServiceTile';

import {
  Badge,
  Button,
  Card,
  CrowdTag,
  Mono,
  AlertBanner,
  Toggle,
} from '../components/ui';

import {
  platformRoute,
  crowdAreas,
  facilities,
  facilityTarget,
  exits,
  exitTarget,
} from '../data/station';

const DESTINATION_SUGGESTIONS = [
  'Platform 5',
  'Platform 7',
  'Exit A',
  'Exit B',
  'Washroom',
  'Food Court',
];

const WHY_SETU = [
  {
    icon: NavigationIcon,
    title: 'Smart navigation',
    desc: 'Indoor walking directions to platforms, coaches, exits and facilities with live recalculation.',
  },
  {
    icon: SparklesIcon,
    title: 'AI-powered assistance',
    desc: 'Ask SETU Assistant about platforms, facilities, exits and station navigation in natural language.',
  },
  {
    icon: UsersIcon,
    title: 'Crowd prediction',
    desc: 'See crowd levels across key station areas before you choose your route.',
  },
  {
    icon: AccessibilityIcon,
    title: 'Accessibility support',
    desc: 'Step-free routes, larger controls, voice guidance and high-contrast mode built in.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <span className="text-sm font-bold text-navy">{q}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted">
          {a}
        </div>
      )}
    </div>
  );
}

function resolveDestination(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const facility = facilities.find(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.zone.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
  if (facility) return { type: 'facility' as const, facility };

  const platformMatch = q.match(/platform\s*(\d+)/i) || q.match(/^(\d+)$/);
  if (platformMatch) {
    const num = platformMatch[1];
    return { type: 'platform' as const, platform: num };
  }

  const exit = exits.find(
    (e) => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q),
  );
  if (exit) return { type: 'exit' as const, exit };

  return null;
}

export function Home() {
  const {
    a11y,
    platform,
    platformChanged,
    festival,
    openOverlay,
    setTab,
    navigateTo,
    setMode,
  } = useSetu();

  const [fromStation] = React.useState('Dadar Station');
  const [destination, setDestination] = React.useState('');
  const [routeAccessible, setRouteAccessible] = React.useState(a11y);

  React.useEffect(() => {
    setRouteAccessible(a11y);
  }, [a11y]);

  const avgCrowd = festival ? 'Very High' : 'Moderate';
  const topCrowdAreas = crowdAreas.slice(0, 4);

  function handleFindRoute() {
    if (routeAccessible !== a11y) {
      setMode(routeAccessible ? 'accessibility' : 'normal');
    }

    const resolved = resolveDestination(destination);

    if (resolved?.type === 'facility') {
      navigateTo(facilityTarget(resolved.facility, routeAccessible || a11y));
      return;
    }

    if (resolved?.type === 'platform') {
      navigateTo(platformRoute(resolved.platform, routeAccessible || a11y));
      return;
    }

    if (resolved?.type === 'exit') {
      navigateTo(exitTarget(resolved.exit));
      return;
    }

    if (destination.trim()) {
      openOverlay('findMe');
      return;
    }

    navigateTo(platformRoute(platform, routeAccessible || a11y));
  }

  function handleSwap() {
    setDestination(fromStation === 'Dadar Station' ? `Platform ${platform}` : 'Dadar Station');
  }

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-canvas">
      {/* Hero */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.4) 48px, rgba(255,255,255,0.4) 49px)',
          }}
          aria-hidden="true"
        />
        <PageContainer className="relative py-8 sm:py-10 lg:py-14">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant={a11y ? 'teal' : 'default'}>
              {a11y ? (
                <>
                  <AccessibilityIcon className="h-3.5 w-3.5" />
                  Accessibility Mode
                </>
              ) : (
                'Normal Mode'
              )}
            </Badge>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-setu-green" />
              Dadar Station · Operational
            </span>
          </div>

          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-amber/80">
              Smart Station Navigation
            </p>
            <h1 className="font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Navigate Dadar Station Smarter
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              SETU helps you find platforms, coaches, exits and essential facilities at Dadar
              Railway Station — with live crowd insights, accessible routing and AI assistance.
            </p>
          </div>

          {/* Journey search card */}
          <div className="relative z-10 mt-8 max-w-3xl rounded-2xl bg-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(7,26,43,0.25)]">
            <p className="mb-3 flex items-center gap-2 txt-xs font-bold uppercase tracking-wider text-muted">
              <RouteIcon className="h-3.5 w-3.5 text-teal" strokeWidth={2.2} />
              Plan your route
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MapPinIcon className="h-5 w-5 shrink-0 text-teal" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <p className="txt-xs font-semibold uppercase tracking-wider text-muted">From</p>
                  <p className="txt-sm font-bold text-navy truncate">{fromStation}</p>
                </div>
              </div>

              <div className="flex justify-center -my-1 relative z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap locations"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-navy shadow-soft hover:bg-slate-50 transition-colors"
                >
                  <ArrowRightIcon className="h-4 w-4 rotate-90" strokeWidth={2.2} />
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
                <NavigationIcon className="h-5 w-5 shrink-0 text-muted" strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <label htmlFor="home-destination" className="txt-xs font-semibold uppercase tracking-wider text-muted">
                    To
                  </label>
                  <input
                    id="home-destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFindRoute()}
                    placeholder="Platform, exit, coach or facility…"
                    className="mt-0.5 w-full bg-transparent txt-sm font-semibold text-navy outline-none placeholder:font-normal placeholder:text-muted"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <Toggle
                checked={routeAccessible}
                onChange={setRouteAccessible}
                label="Accessible route"
                description="Prioritise lifts, ramps and step-free paths"
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button size="lg" full className="sm:flex-1" onClick={handleFindRoute}>
                <NavigationIcon className="h-4 w-4" />
                Find Route
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {DESTINATION_SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setDestination(chip)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-navy"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        {/* Quick services */}
        <PageSection title="Quick Services" subtitle="Everything you need inside Dadar">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <QuickLinkTile
              label="Live Crowd"
              sublabel="Current levels"
              icon={<UsersIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('crowd')}
              accent="red"
            />
            <QuickLinkTile
              label="Find Coach"
              sublabel="Your coach position"
              icon={<TrainFrontIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => setTab('coach')}
              accent="amber"
            />
            <QuickLinkTile
              label="Station Map"
              sublabel="Indoor navigation"
              icon={<MapIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => setTab('map')}
              accent="navy"
            />
            <QuickLinkTile
              label="Find Exit"
              sublabel="Best route out"
              icon={<DoorOpenIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('exits')}
              accent="teal"
            />
            <QuickLinkTile
              label="Medical Help"
              sublabel="Emergency support"
              icon={<HeartPulseIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('medical')}
              accent="red"
            />
            <QuickLinkTile
              label="AI Assistant"
              sublabel="Ask SETU anything"
              icon={<BotIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => {
                const btn = document.querySelector('[aria-label="Open SETU chatbot"]') as HTMLButtonElement | null;
                btn?.click();
              }}
              accent="navy"
            />
          </div>
        </PageSection>

        {platformChanged && (
          <AlertBanner
            variant="warning"
            icon={<TriangleAlertIcon className="h-5 w-5 text-amber-700" />}
            onClick={() => navigateTo(platformRoute(platform, a11y))}
            action={<ArrowRightIcon className="h-4 w-4 text-amber-700" />}
          >
            <span className="block font-bold text-amber-900">
              Platform changed to <Mono>7</Mono>
            </span>
            <span className="mt-0.5 block text-amber-700">Your route has been recalculated.</span>
          </AlertBanner>
        )}

        {/* Live station status */}
        <div className="grid gap-5 py-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <PageSection title="Live Station Status" subtitle="Dadar · WR & CR">
              <Card className="h-full p-5" hover>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="txt-sm text-muted">Overall crowd</span>
                    <CrowdTag level={avgCrowd as 'Moderate' | 'Very High'} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="txt-sm text-muted">Your platform</span>
                    <Mono className="text-lg font-bold text-navy">{platform}</Mono>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="txt-sm text-muted">Route mode</span>
                    <Badge variant={a11y ? 'teal' : 'default'}>
                      {a11y ? 'Accessible' : 'Standard'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="txt-sm text-muted">Train status</span>
                    <Badge variant="success">On Time</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="txt-sm text-muted">Connectivity</span>
                    <span className="flex items-center gap-1.5 txt-sm font-bold text-navy">
                      <WifiIcon className="h-4 w-4 text-teal" />
                      Available
                    </span>
                  </div>
                </div>
                <Button variant="secondary" full className="mt-5" onClick={() => openOverlay('crowd')}>
                  View crowd dashboard
                </Button>
              </Card>
            </PageSection>
          </div>

          <div className="lg:col-span-3">
            <PageSection title="Crowd by area" subtitle="Updated every 30 seconds">
              <div className="grid gap-3 sm:grid-cols-2">
                {topCrowdAreas.map((area) => (
                  <Card key={area.id} className="p-4" hover>
                    <div className="flex items-start justify-between gap-3">
                      <p className="txt-sm font-bold text-navy">{area.name}</p>
                      <CrowdTag level={area.level} />
                    </div>
                    <p className="mt-2 txt-xs leading-relaxed text-muted">{area.reason}</p>
                  </Card>
                ))}
              </div>
            </PageSection>
          </div>
        </div>

        {/* Why SETU */}
        <PageSection title="Why SETU" subtitle="Built for Indian railway travellers">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_SETU.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-5" hover>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 font-display font-bold text-navy">{title}</h3>
                <p className="mt-1.5 txt-sm leading-relaxed text-muted">{desc}</p>
              </Card>
            ))}
          </div>
        </PageSection>

        {/* AI Assistant CTA */}
        <section className="py-6 sm:py-8">
          <Card className="overflow-hidden" hover>
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-amber-700">
                    <BrainIcon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <Badge variant="teal">AI Assistant</Badge>
                </div>
                <h2 className="font-display text-xl font-bold text-navy">Ask SETU anything</h2>
                <p className="mt-2 max-w-xl txt-sm leading-relaxed text-muted">
                  Get instant answers about platforms, facilities, exits and navigation at Dadar
                  station — powered by SETU&apos;s station knowledge base.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Where is the booking office?', 'How do I reach Platform 5?'].map((q) => (
                    <span
                      key={q}
                      className="rounded-full bg-slate-100 px-3 py-1.5 txt-xs font-semibold text-slate-600"
                    >
                      {q}
                    </span>
                  ))}
                </div>
                <Button
                  className="mt-5"
                  onClick={() => {
                    const btn = document.querySelector('[aria-label="Open SETU chatbot"]') as HTMLButtonElement | null;
                    btn?.click();
                  }}
                >
                  <BotIcon className="h-4 w-4" />
                  Open AI Assistant
                </Button>
              </div>
              <div className="hidden sm:flex w-48 lg:w-56 shrink-0 items-end justify-center bg-navy/5 p-6">
                <BotIcon className="h-24 w-24 text-navy/10" strokeWidth={1} />
              </div>
            </div>
          </Card>
        </section>

        {/* Explore + Safety */}
        <PageSection title="Explore Station" subtitle="Facilities and emergency support">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceTile
              title="Find Destination"
              subtitle="Search platforms, facilities and exits"
              icon={<MapPinIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('findMe')}
              accent="teal"
            />
            <ServiceTile
              title="Journey Routing"
              subtitle="Step-by-step station navigation"
              icon={<RouteIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => setTab('journey')}
              accent="navy"
            />
            <ServiceTile
              title="Medical Help"
              subtitle="Nearest hospital and station assistance"
              icon={<HeartPulseIcon className="h-5 w-5" strokeWidth={2} />}
              onClick={() => openOverlay('medical')}
              accent="red"
            />
            <ServiceTile
              title="Railway Helpline"
              subtitle="139 · Available 24/7"
              icon={<ShieldIcon className="h-5 w-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('medical')}
              accent="amber"
            />
          </div>
        </PageSection>

        {/* Accessibility banner */}
        <section className="py-4">
          <div className="overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal text-white">
                <AccessibilityIcon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold">Built for accessibility</h2>
                <p className="mt-1.5 max-w-2xl txt-sm leading-relaxed text-white/65">
                  Larger controls, accessibility-first navigation and higher contrast help make
                  station travel easier for everyone.
                </p>
              </div>
              <Button
                variant="teal"
                onClick={() => setTab('profile')}
                className="shrink-0"
              >
                Accessibility settings
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <PageSection title="Frequently Asked Questions">
          <div className="space-y-2">
            {[
              {
                q: 'How does SETU help me navigate Dadar station?',
                a: 'SETU provides indoor walking directions from your current location to platforms, coaches, exits and facilities. It recalculates routes when platforms change or crowd levels shift.',
              },
              {
                q: 'Can SETU work in accessibility mode?',
                a: 'Yes. Accessibility mode enables larger controls, voice guidance, step-free route priority, and higher contrast throughout the app.',
              },
              {
                q: 'How accurate is the live crowd information?',
                a: 'Crowd levels are estimated using anonymised device density, daily movement patterns, and historical event data. They update every 30 seconds.',
              },
            ].map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </PageSection>
      </PageContainer>

      <AppFooter />
    </div>
  );
}
