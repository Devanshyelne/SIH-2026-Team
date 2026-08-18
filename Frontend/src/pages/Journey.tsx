import React from 'react';
import {
  BellIcon,
  CircleDotIcon,
  DoorOpenIcon,
  MapPinIcon,
  NavigationIcon,
  TrainFrontIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { PageContainer, PageHero, PageSection } from '../components/layout/PageContainer';
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  Mono,
  StatTile,
} from '../components/ui';
import { exitTarget, exits, platformRoute } from '../data/station';

export function Journey() {
  const { a11y, platform, platformChanged, navigateTo, setTab } = useSetu();
  const nearestExit = exits[1];

  const steps = [
    {
      id: 'current',
      label: 'You are here',
      detail: 'Dadar · Middle Concourse',
      status: 'current',
      Icon: CircleDotIcon,
    },
    {
      id: 'platform',
      label: `Platform ${platform}`,
      detail: '3 min walk · via Main FOB',
      status: 'upcoming',
      Icon: TrainFrontIcon,
      action: () => navigateTo(platformRoute(platform, a11y)),
    },
    {
      id: 'coach',
      label: 'Coach D3',
      detail: 'Second Class · 70 m along platform',
      status: 'upcoming',
      Icon: TrainFrontIcon,
      action: () => setTab('coach'),
    },
    {
      id: 'destination',
      label: 'Thane',
      detail: 'Arrives 09:21 · 9 stops',
      status: 'destination',
      Icon: MapPinIcon,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <PageHero
        title="My Journey"
        subtitle="Mumbai Central → Thane · Today, 15 Aug"
        compact
      />

      <PageContainer className="pb-10">
        {platformChanged && (
          <div className="pt-4">
            <AlertBanner
              variant="warning"
              icon={<TriangleAlertIcon className="w-5 h-5 text-[#8a5b00]" strokeWidth={2} />}
            >
              Platform changed <Mono className="font-semibold">5 → 7</Mono>. Route and coach
              position updated.
            </AlertBanner>
          </div>
        )}

        {/* Journey timeline */}
        <PageSection title="Journey Timeline" subtitle="Your path through the station">
          <Card className="p-5 sm:p-6">
            <ol className="relative space-y-0">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                const isCurrent = step.status === 'current';
                return (
                  <li key={step.id} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-teal text-white shadow-soft'
                            : step.status === 'destination'
                              ? 'bg-navy text-white'
                              : 'bg-slate-100 text-navy'
                        }`}
                      >
                        <step.Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      {!isLast && (
                        <span className="w-0.5 flex-1 bg-border mt-2 min-h-[24px]" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display font-semibold text-navy">{step.label}</p>
                          <p className="txt-sm text-muted mt-0.5">{step.detail}</p>
                        </div>
                        {isCurrent && <Badge variant="teal">Current</Badge>}
                      </div>
                      {step.action && (
                        <button
                          type="button"
                          onClick={step.action}
                          className="txt-sm font-semibold text-teal mt-2 hover:underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          <NavigationIcon className="w-3.5 h-3.5" strokeWidth={2} />
                          Navigate
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        </PageSection>

        {/* Train info grid */}
        <PageSection title="Train Information">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile label="Platform" value={platform} />
            <StatTile label="Departure" value="08:42" />
            <StatTile label="Coach" value="D3" sub="Second Class" />
            <div className="rounded-xl bg-[#E7F6EE] px-3 py-2.5">
              <p className="txt-xs text-muted uppercase tracking-wider font-medium">Status</p>
              <div className="mt-1">
                <Badge variant="success">
                  <span className="w-1.5 h-1.5 rounded-full bg-setu-green animate-pulse-soft" />
                  ON TIME
                </Badge>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Quick navigation cards */}
        <PageSection title="Quick Navigation">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-5" hover>
              <TrainFrontIcon className="w-6 h-6 text-navy mb-3" strokeWidth={1.8} />
              <p className="font-display font-semibold text-navy">Platform {platform}</p>
              <p className="txt-sm text-muted mt-0.5">3 min walk · Main FOB</p>
              <Button
                full
                className="mt-4"
                size="sm"
                onClick={() => navigateTo(platformRoute(platform, a11y))}
              >
                Navigate
              </Button>
            </Card>
            <Card className="p-5" hover>
              <TrainFrontIcon className="w-6 h-6 text-navy mb-3" strokeWidth={1.8} />
              <p className="font-display font-semibold text-navy">Coach D3</p>
              <p className="txt-sm text-muted mt-0.5">Second Class · 70 m ahead</p>
              <Button full className="mt-4" size="sm" variant="secondary" onClick={() => setTab('coach')}>
                Find coach
              </Button>
            </Card>
            <Card className="p-5" hover>
              <DoorOpenIcon className="w-6 h-6 text-navy mb-3" strokeWidth={1.8} />
              <p className="font-display font-semibold text-navy">{nearestExit.name}</p>
              <p className="txt-sm text-muted mt-0.5">
                {nearestExit.walkMin} min · {nearestExit.distanceM} m
              </p>
              <Button
                full
                className="mt-4"
                size="sm"
                variant="secondary"
                onClick={() => navigateTo(exitTarget(nearestExit))}
              >
                Find exit
              </Button>
            </Card>
          </div>
        </PageSection>

        {/* Reminders */}
        <PageSection title="Reminders">
          <Card className="divide-y divide-border overflow-hidden">
            {[
              { label: 'Leave for platform', detail: '08:34 · 8 min before departure' },
              { label: 'Alight at Thane', detail: 'Alert 2 stations before' },
              { label: 'Platform change alerts', detail: 'Always on for live journeys' },
            ].map((r) => (
              <div key={r.label} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <BellIcon className="w-4 h-4 text-navy" strokeWidth={1.9} />
                </div>
                <div className="flex-1">
                  <p className="txt-sm font-semibold text-navy">{r.label}</p>
                  <p className="txt-sm text-muted">{r.detail}</p>
                </div>
                <Badge variant="success">On</Badge>
              </div>
            ))}
          </Card>
        </PageSection>

        {/* History */}
        <PageSection title="Journey History">
          <Card className="p-4" hover>
            <p className="txt-sm font-medium text-navy">Dadar → Andheri</p>
            <p className="txt-sm text-muted mt-0.5">Yesterday · Platform 3 · Coach D2</p>
          </Card>
        </PageSection>
      </PageContainer>
    </div>
  );
}
