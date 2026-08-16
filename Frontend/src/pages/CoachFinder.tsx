import React from 'react';
import { NavigationIcon, TrainFrontIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, Mono, ScreenHeader } from '../components/ui';
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
      <ScreenHeader title="Smart Coach Finder" subtitle="Find where to stand on the platform" />

      <div className="px-4 py-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="txt-xs uppercase tracking-wider text-muted">Train</p>
              <p className="font-display font-semibold txt-base text-navy">
                Mumbai Central → Thane
              </p>
            </div>
            <div className="text-right">
              <p className="txt-xs uppercase tracking-wider text-muted">Platform</p>
              <Mono className="txt-xl font-semibold text-navy">{platform}</Mono>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded bg-[#FDF3DC] px-2 py-1">
            <TrainFrontIcon className="w-4 h-4 text-[#8a5b00]" strokeWidth={2} />
            <span className="txt-sm font-semibold text-[#8a5b00]">Train arriving · 4 min</span>
          </div>
        </Card>

        <section aria-labelledby="coach-class">
          <h2
            id="coach-class"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Coach type
          </h2>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {coachClasses.map((k) => {
              const on = coachClass === k;
              return (
                <button
                  key={k}
                  aria-pressed={on}
                  onClick={() => pickClass(k)}
                  className={`shrink-0 rounded-full px-3.5 py-2 txt-sm font-semibold border transition-colors duration-150 ease-out ${
                  on ?
                  'bg-navy text-white border-navy' :
                  'bg-white text-navy border-slate-300 hover:border-navy'}`
                  }>
                  
                  {k}
                </button>);

            })}
          </div>
        </section>

        <section aria-labelledby="coach-layout">
          <h2
            id="coach-layout"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Coach arrangement
          </h2>
          <Card className="p-3">
            <p className="txt-xs text-muted mb-2">
              Front of platform <span className="float-right">Rear</span>
            </p>
            <div className="flex gap-1.5">
              {coaches.map((c) => {
                const on = c.id === selectedCoach;
                const dim = c.klass !== coachClass;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      selectCoach(c.id);
                      setCoachClass(c.klass);
                    }}
                    aria-pressed={on}
                    className={`flex-1 rounded-md border-2 py-2.5 transition-colors duration-150 ease-out ${
                    on ?
                    'bg-amber border-amber text-navy-dark' :
                    dim ?
                    'bg-slate-50 border-slate-200 text-slate-400' :
                    'bg-white border-slate-300 text-navy'}`
                    }>
                    
                    <Mono className="txt-sm font-semibold">{c.id}</Mono>
                  </button>);

              })}
            </div>
            <div className="mt-2 h-1 rounded bg-slate-200" aria-hidden="true" />
            <p className="txt-xs text-muted mt-2">
              Your position on the platform is marked in{' '}
              <span className="font-semibold text-[#8a5b00]">amber</span>.
            </p>
          </Card>
        </section>

        <Card className="p-4 border-2 border-amber">
          <p className="txt-xs uppercase tracking-wider text-muted">Selected coach</p>
          <div className="flex items-end justify-between gap-3 mt-0.5">
            <div>
              <p className="font-display font-semibold txt-xl text-navy">
                {active.klass} · <Mono>{active.id}</Mono>
              </p>
              <p className="txt-sm text-muted">
                Approximately <Mono className="font-semibold text-navy">{active.aheadM} m</Mono>{' '}
                ahead · <Mono>{Math.max(1, Math.round(active.aheadM / 45))}</Mono> min walk
              </p>
            </div>
          </div>
          <Button
            full
            className="mt-3"
            onClick={() =>
            navigateTo({
              ...platformRoute(platform, a11y),
              id: `platform-coach-${active.id}`,
              label: `Coach ${active.id} · Platform ${platform}`,
              sublabel: `${active.klass} · ${active.aheadM} m along the platform`,
              steps: [
              ...platformRoute(platform, a11y).steps.slice(0, -1),
              `Walk ${active.aheadM} metres along Platform ${platform} to Coach ${active.id}.`,
              `You have arrived at Coach ${active.id}.`]

            })
            }>
            
            <NavigationIcon className="w-4 h-4" strokeWidth={2} />
            Navigate to coach
          </Button>
        </Card>

        <Card className="divide-y divide-slate-200">
          {[
          { label: 'Train arriving', detail: 'Platform ' + platform + ' · 4 min', tone: 'amber' },
          { label: 'Boarding', detail: 'Doors open on the left', tone: 'muted' },
          { label: 'Coach nearby', detail: 'Alert when you are within 80 m', tone: 'green' }].
          map((s) =>
          <div key={s.label} className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="txt-sm font-semibold text-navy">{s.label}</p>
                <p className="txt-sm text-muted">{s.detail}</p>
              </div>
              <span
              className={`w-2 h-2 rounded-full ${
              s.tone === 'amber' ?
              'bg-amber' :
              s.tone === 'green' ?
              'bg-setu-green' :
              'bg-slate-300'}`
              }
              aria-hidden="true" />
            
            </div>
          )}
        </Card>
      </div>
    </div>);

}