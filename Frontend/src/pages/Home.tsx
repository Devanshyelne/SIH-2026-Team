import React from 'react';
import {
  AccessibilityIcon,
  ArrowRightIcon,
  BotIcon,
  ChevronDownIcon,
  DoorOpenIcon,
  HeartPulseIcon,
  LayoutGridIcon,
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  SearchIcon,
  ShieldIcon,
  TrainFrontIcon,
  TriangleAlertIcon,
  UsersIcon,
  UtensilsIcon,
  WifiIcon,
} from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { AppFooter } from '../components/layout/AppFooter';
import { PageContainer, PageSection } from '../components/layout/PageContainer';
import { QuickLinkTile, ServiceTile } from '../components/layout/ServiceTile';
import {
  Badge,
  Button,
  Card,
  CrowdTag,
  Mono,
  StatTile,
  AlertBanner,
} from '../components/ui';
import { platformRoute, crowdAreas } from '../data/station';

const FAQ = [
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
  {
    q: 'What should I do in a medical emergency?',
    a: 'Tap "I feel unwell" on the home screen or use the Medical section to find the nearest hospital, station medical assistance, or call Railway Helpline 139.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border hairline rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tap w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors duration-150"
      >
        <span className="txt-sm font-semibold text-navy">{q}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 txt-sm text-muted leading-relaxed border-t hairline pt-3 animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
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
    triggerPlatformChange,
  } = useSetu();

  const [search, setSearch] = React.useState('');

  const avgCrowd = festival ? 'Very High' : 'Moderate';

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      {/* ── HERO ── */}
      <section className="gradient-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber/10 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-teal/10 translate-y-1/2 -translate-x-1/4" />
        </div>
        <PageContainer className="relative py-10 sm:py-14 lg:py-16">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={a11y ? 'teal' : 'default'}>
              {a11y ? (
                <>
                  <AccessibilityIcon className="w-3 h-3" strokeWidth={2} />
                  Accessibility Mode
                </>
              ) : (
                'Normal Mode'
              )}
            </Badge>
            <Badge variant="success">
              <span className="w-1.5 h-1.5 rounded-full bg-setu-green animate-pulse-soft" />
              Station Operational
            </Badge>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] tracking-tight leading-tight max-w-2xl">
            Navigate Dadar Station with confidence
          </h1>
          <p className="txt-base sm:txt-lg text-white/70 mt-3 max-w-xl leading-relaxed">
            Smart indoor navigation for platforms, coaches, exits and facilities — with live crowd
            updates and accessibility-first routing.
          </p>

          {/* Search box */}
          <div className="mt-8 bg-white rounded-2xl shadow-elevated p-1.5 sm:p-2 max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
                <SearchIcon className="w-5 h-5 text-muted shrink-0" strokeWidth={2} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && openOverlay('findMe')}
                  placeholder="Search platform, exit, coach or facility..."
                  aria-label="Search station"
                  className="flex-1 bg-transparent txt-sm text-navy placeholder:text-muted outline-none min-w-0"
                />
              </div>
              <Button
                size="lg"
                className="sm:px-8 rounded-xl"
                onClick={() => openOverlay('findMe')}
              >
                <NavigationIcon className="w-4 h-4" strokeWidth={2} />
                Navigate
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1">
              {['Platform 5', 'Exit B', 'Washroom', 'Food Court'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSearch(chip);
                    openOverlay('findMe');
                  }}
                  className="txt-xs font-medium text-muted hover:text-navy bg-slate-50 hover:bg-slate-100 rounded-full px-2.5 py-1 transition-colors duration-150"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigateTo(platformRoute(platform, a11y))}
              className="inline-flex items-center gap-2 txt-sm font-semibold text-white/90 hover:text-white transition-colors duration-150"
            >
              <TrainFrontIcon className="w-4 h-4" strokeWidth={2} />
              Go to Platform {platform}
              <ArrowRightIcon className="w-4 h-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => setTab('map')}
              className="inline-flex items-center gap-2 txt-sm font-semibold text-white/90 hover:text-white transition-colors duration-150"
            >
              <MapIcon className="w-4 h-4" strokeWidth={2} />
              Open Station Map
              <ArrowRightIcon className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        {/* ── QUICK SERVICES ── */}
        <PageSection title="Station Services" subtitle="Quick access to everything you need">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            <QuickLinkTile
              label="Live Crowd"
              sublabel="Updated 30s ago"
              icon={<UsersIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('crowd')}
            />
            <QuickLinkTile
              label="Find Exit"
              sublabel="Best route out"
              icon={<DoorOpenIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('exits')}
            />
            <QuickLinkTile
              label="Coach Finder"
              sublabel="Where to stand"
              icon={<TrainFrontIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => setTab('coach')}
            />
            <QuickLinkTile
              label="Medical"
              sublabel="Emergency help"
              icon={<HeartPulseIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('medical')}
            />
            <QuickLinkTile
              label="Station Map"
              sublabel="Indoor navigation"
              icon={<MapIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => setTab('map')}
            />
          </div>
        </PageSection>

        {/* ── ALERTS ── */}
        {platformChanged && (
          <AlertBanner
            variant="warning"
            icon={<TriangleAlertIcon className="w-5 h-5 text-[#8a5b00]" strokeWidth={2} />}
            onClick={() => navigateTo(platformRoute(platform, a11y))}
            action={<ArrowRightIcon className="w-4 h-4 text-[#8a5b00]" strokeWidth={2.2} />}
          >
            <span className="block font-semibold">
              Platform changed to <Mono>7</Mono>
            </span>
            <span className="block text-[#8a5b00] mt-0.5">
              New route recalculated · 3 min walk
            </span>
          </AlertBanner>
        )}

        {/* ── LIVE STATUS + JOURNEY ── */}
        <div className="grid lg:grid-cols-5 gap-5 py-2">
          {/* Live station status */}
          <div className="lg:col-span-2">
            <PageSection title="Live Station Status" subtitle="Dadar · WR & CR">
              <Card className="p-4 h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="txt-sm text-muted">Overall crowd</span>
                    <CrowdTag level={avgCrowd as 'Moderate' | 'Very High'} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="txt-sm text-muted">Your platform</span>
                    <Mono className="font-semibold text-navy txt-lg">{platform}</Mono>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="txt-sm text-muted">Train status</span>
                    <Badge variant="success">On Time</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="txt-sm text-muted">Network</span>
                    <span className="txt-sm font-medium text-navy flex items-center gap-1">
                      <WifiIcon className="w-3.5 h-3.5 text-teal" strokeWidth={2} />
                      Available
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  full
                  className="mt-4"
                  onClick={() => openOverlay('crowd')}
                >
                  View detailed crowd map
                </Button>
              </Card>
            </PageSection>
          </div>

          {/* Live journey */}
          <div className="lg:col-span-3">
            <PageSection
              title="Your Journey"
              subtitle="Mumbai Central → Thane"
              action={
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-setu-green animate-pulse-soft" />
                  ON TIME
                </Badge>
              }
            >
              <Card className="overflow-hidden h-full" hover>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display font-semibold text-lg text-navy">
                        Mumbai Central → Thane
                      </p>
                      <p className="txt-sm text-muted mt-0.5">Fast local · 12 coaches · CR corridor</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <StatTile label="Platform" value={platform} />
                    <StatTile label="Departs" value="08:42" />
                    <StatTile label="Coach" value="D3" sub="Second Class" />
                  </div>
                </div>
                <div className="border-t hairline p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50/50">
                  <Button variant="secondary" onClick={() => setTab('journey')}>
                    Journey details
                  </Button>
                  <Button variant="secondary" onClick={() => setTab('coach')}>
                    Find coach
                  </Button>
                  <Button
                    className="col-span-2 sm:col-span-1"
                    onClick={() => navigateTo(platformRoute(platform, a11y))}
                  >
                    Navigate now
                  </Button>
                </div>
              </Card>
            </PageSection>
          </div>
        </div>

        {/* ── FESTIVAL ALERT ── */}
        {festival && (
          <Card className="p-5 border-l-4 border-l-setu-red mb-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FBE9E9] flex items-center justify-center shrink-0">
                <UsersIcon className="w-6 h-6 text-setu-red" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-navy">High crowd — Ganpati festival</p>
                <p className="txt-sm text-muted mt-1">
                  Large movement near Main FOB and Exit B. Alternative routes available.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CrowdTag level="Very High" />
                  <Button size="sm" variant="secondary" onClick={() => openOverlay('crowd')}>
                    View crowd dashboard
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── EXPLORE SERVICES ── */}
        <PageSection title="Explore Station" subtitle="Find what you need inside Dadar station">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <ServiceTile
              label="Find Me"
              description="Search any facility, platform or exit"
              icon={<MapPinIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('findMe')}
              accent="teal"
            />
            <ServiceTile
              label="Food & Dining"
              description="Restaurants, stalls and food courts"
              icon={<UtensilsIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('more')}
              accent="amber"
            />
            <ServiceTile
              label="All Facilities"
              description="Washrooms, tickets, parking and more"
              icon={<LayoutGridIcon className="w-5 h-5" strokeWidth={1.9} />}
              onClick={() => openOverlay('more')}
            />
            <ServiceTile
              label="Medical Help"
              description="Nearest hospital and station aid"
              icon={<HeartPulseIcon className="w-5 h-5" strokeWidth={2} />}
              onClick={() => openOverlay('medical')}
              accent="red"
            />
          </div>
        </PageSection>

        {/* ── CROWD OVERVIEW ── */}
        <PageSection title="Crowd Overview" subtitle="Current levels across key areas">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crowdAreas.slice(0, 4).map((area) => (
              <Card key={area.id} className="p-4" hover>
                <p className="txt-sm font-semibold text-navy">{area.name}</p>
                <div className="mt-2">
                  <CrowdTag level={area.level} />
                </div>
                <p className="txt-xs text-muted mt-2 leading-relaxed">{area.reason}</p>
              </Card>
            ))}
          </div>
        </PageSection>

        {/* ── HOW SETU WORKS ── */}
        <PageSection title="How SETU Works" subtitle="Three steps to stress-free station navigation">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Set your destination',
                desc: 'Search for a platform, coach, exit or any station facility.',
              },
              {
                step: '02',
                title: 'Get smart directions',
                desc: 'SETU calculates the shortest walk with crowd-aware routing.',
              },
              {
                step: '03',
                title: 'Navigate with guidance',
                desc: 'Follow step-by-step directions with voice support in accessibility mode.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white border hairline rounded-2xl p-5 shadow-card"
              >
                <Mono className="text-3xl font-bold text-navy/10">{item.step}</Mono>
                <p className="font-display font-semibold text-navy mt-1">{item.title}</p>
                <p className="txt-sm text-muted mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* ── ACCESSIBILITY ── */}
        <section className="py-6 sm:py-8">
          <div className="bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal/10 -translate-y-1/2 translate-x-1/4"
              aria-hidden="true"
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center shrink-0">
                <AccessibilityIcon className="w-7 h-7 text-teal-100" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <h2 className="font-display font-semibold text-xl">Built for accessibility</h2>
                <p className="txt-sm text-white/70 mt-1.5 leading-relaxed max-w-lg">
                  Larger controls, voice-first guidance, lift and ramp priority routing, and higher
                  contrast — designed for every traveller.
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

        {/* ── AI ASSISTANT ── */}
        <section className="py-6 sm:py-8">
          <div className="bg-white border hairline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber/15 flex items-center justify-center shrink-0">
              <BotIcon className="w-7 h-7 text-[#8a5b00]" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-semibold text-xl text-navy">SETU AI Assistant</h2>
              <p className="txt-sm text-muted mt-1.5 leading-relaxed max-w-lg">
                Ask anything about Dadar station — platforms, facilities, exits, and walking
                directions. Available 24/7 via the chat button.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Where is the booking office?', 'How to reach Platform 5?'].map((q) => (
                  <span
                    key={q}
                    className="txt-xs font-medium text-navy bg-slate-100 rounded-full px-3 py-1"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SAFETY ── */}
        <PageSection title="Safety & Emergency" subtitle="Help is always nearby">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 flex items-start gap-4" hover>
              <div className="w-11 h-11 rounded-xl bg-[#FBE9E9] flex items-center justify-center shrink-0">
                <HeartPulseIcon className="w-5 h-5 text-setu-red" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display font-semibold text-navy">Medical emergency</p>
                <p className="txt-sm text-muted mt-0.5">
                  Find nearest hospital or station medical desk instantly.
                </p>
                <button
                  type="button"
                  onClick={() => openOverlay('medical')}
                  className="txt-sm font-semibold text-setu-red mt-2 hover:underline underline-offset-2"
                >
                  Get medical help →
                </button>
              </div>
            </Card>
            <Card className="p-5 flex items-start gap-4" hover>
              <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                <ShieldIcon className="w-5 h-5 text-navy" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display font-semibold text-navy">Railway Helpline 139</p>
                <p className="txt-sm text-muted mt-0.5">
                  For emergencies, security concerns, or station assistance.
                </p>
                <p className="txt-sm font-semibold text-navy mt-2">Available 24/7</p>
              </div>
            </Card>
          </div>
        </PageSection>

        {/* ── STATION UPDATES ── */}
        {!platformChanged && (
          <PageSection title="Station Updates">
            <Card className="p-5" hover>
              <p className="txt-sm text-navy leading-relaxed">
                Platform announcements for your train are being monitored. SETU will automatically
                recalculate your route if the platform changes.
              </p>
              <button
                type="button"
                onClick={triggerPlatformChange}
                className="txt-sm font-semibold text-teal hover:underline underline-offset-2 mt-3"
              >
                Simulate a platform change
              </button>
            </Card>
          </PageSection>
        )}

        {/* ── FAQ ── */}
        <PageSection title="Frequently Asked Questions" subtitle="Everything you need to know about SETU">
          <div className="space-y-2">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </PageSection>
      </PageContainer>

      <AppFooter />
    </div>
  );
}
