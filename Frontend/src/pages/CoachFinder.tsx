import React from 'react';
import { NavigationIcon, TrainFrontIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { PageContainer, PageHero, PageSection } from '../components/layout/PageContainer';
import {
  Badge,
  Button,
  Card,
  CategoryPill,
  Mono,
  StatTile,
} from '../components/ui';
import { coachClasses, coaches, platformRoute } from '../data/station';

export function CoachFinder() {
  const { a11y, platform, coachClass, setCoachClass, selectedCoach, selectCoach, navigateTo } =
    useSetu();

  const active = coaches.find((c) => c.id === selectedCoach) ?? coaches[2];

  function pickClass(k: string) {
    setCoachClass(k);
    const first = coaches.find((c) => c.klass === k);
    if (first) selectCoach(first.id);
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <PageHero
        title="Smart Coach Finder"
        subtitle="Find exactly where to stand on the platform"
        compact
      />

      <PageContainer className="pb-10">
        <div className="grid lg:grid-cols-3 gap-5 -mt-2">
          {/* Left: train info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-5" hover>
              <p className="txt-xs uppercase tracking-wider text-muted font-medium">Train</p>
              <p className="font-display font-semibold text-lg text-navy mt-1">
                Mumbai Central → Thane
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <StatTile label="Platform" value={platform} />
                <StatTile label="Arriving" value="4 min" />
              </div>
              <Badge variant="warning" className="mt-3">
                <TrainFrontIcon className="w-3 h-3" strokeWidth={2} />
                Train arriving soon
              </Badge>
            </Card>

            <Card className="p-5 border-2 border-amber">
              <p className="txt-xs uppercase tracking-wider text-muted font-medium">Selected coach</p>
              <p className="font-display font-semibold text-2xl text-navy mt-1">
                {active.klass} · <Mono>{active.id}</Mono>
              </p>
              <p className="txt-sm text-muted mt-1">
                <Mono className="font-semibold text-navy">{active.aheadM} m</Mono> ahead ·{' '}
                <Mono>{Math.max(1, Math.round(active.aheadM / 45))}</Mono> min walk
              </p>
              <Button
                full
                className="mt-4"
                onClick={() =>
                  navigateTo({
                    ...platformRoute(platform, a11y),
                    id: `platform-coach-${active.id}`,
                    label: `Coach ${active.id} · Platform ${platform}`,
                    sublabel: `${active.klass} · ${active.aheadM} m along the platform`,
                    steps: [
                      ...platformRoute(platform, a11y).steps.slice(0, -1),
                      `Walk ${active.aheadM} metres along Platform ${platform} to Coach ${active.id}.`,
                      `You have arrived at Coach ${active.id}.`,
                    ],
                  })
                }
              >
                <NavigationIcon className="w-4 h-4" strokeWidth={2} />
                Navigate to coach
              </Button>
            </Card>
          </div>

          {/* Right: coach layout */}
          <div className="lg:col-span-2 space-y-4">
            <PageSection title="Coach Type">
              <div className="flex flex-wrap gap-2">
                {coachClasses.map((k) => (
                  <CategoryPill key={k} active={coachClass === k} onClick={() => pickClass(k)}>
                    {k}
                  </CategoryPill>
                ))}
              </div>
            </PageSection>

            <PageSection title="Coach Arrangement" subtitle="Front of platform → Rear">
              <Card className="p-5">
                <div className="flex gap-2">
                  {coaches.map((c) => {
                    const on = c.id === selectedCoach;
                    const dim = c.klass !== coachClass;
                    return (
                      <button
                        key={c.id}
                        onClick={() => { selectCoach(c.id); setCoachClass(c.klass); }}
                        aria-pressed={on}
                        className={`flex-1 rounded-xl border-2 py-3 transition-all duration-150 ${
                          on
                            ? 'bg-amber border-amber text-navy-dark shadow-soft scale-[1.02]'
                            : dim
                              ? 'bg-slate-50 border-border text-slate-400'
                              : 'bg-white border-border text-navy hover:border-navy/40'
                        }`}
                      >
                        <Mono className="txt-sm font-semibold block">{c.id}</Mono>
                        <span className="txt-xs opacity-70 mt-0.5 block">{c.klass}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 relative">
                    <div
                      className="absolute top-0 h-full w-3 rounded-full bg-amber"
                      style={{ left: `${(active.position / coaches.length) * 100}%` }}
                    />
                  </div>
                  <span className="txt-xs text-muted whitespace-nowrap">Your position</span>
                </div>
                <p className="txt-xs text-muted mt-3">
                  Selected coach highlighted in{' '}
                  <span className="font-semibold text-[#8a5b00]">amber</span>. Walk{' '}
                  <Mono>{active.aheadM} m</Mono> along the platform.
                </p>
              </Card>
            </PageSection>

            <PageSection title="Boarding Status">
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Train arriving', detail: `Platform ${platform} · 4 min`, color: 'bg-amber' },
                  { label: 'Boarding', detail: 'Doors open on the left', color: 'bg-slate-300' },
                  { label: 'Coach nearby', detail: 'Alert within 80 m', color: 'bg-setu-green' },
                ].map((s) => (
                  <Card key={s.label} className="p-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color} block mb-2`} />
                    <p className="txt-sm font-semibold text-navy">{s.label}</p>
                    <p className="txt-xs text-muted mt-0.5">{s.detail}</p>
                  </Card>
                ))}
              </div>
            </PageSection>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
