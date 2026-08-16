import React from 'react';
import { NavigationIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, CrowdTag, Mono, ScreenHeader } from '../components/ui';
import { exitTarget, exits } from '../data/station';

export function ExitFinder() {
  const { closeOverlay, navigateTo, festival } = useSetu();
  const recommended = festival ? exits[0] : exits[1];

  return (
    <div className="flex-1 flex flex-col bg-canvas">
      <ScreenHeader
        title="Find your exit"
        subtitle="Dadar Railway Station"
        onBack={closeOverlay} />
      

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        <Card className="p-4 border-2 border-setu-green">
          <p className="txt-xs font-semibold uppercase tracking-wider text-setu-green">
            Recommended
          </p>
          <p className="font-display font-semibold txt-xl text-navy mt-0.5">
            {recommended.name}
          </p>
          <p className="txt-sm text-muted">{recommended.side}</p>
          <p className="txt-sm text-navy mt-2">
            {festival ?
            'Festival crowd near Exit B. Exit A adds 1 minute with a much lower crowd.' :
            recommended.note}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="txt-sm text-navy">
              <Mono className="font-semibold">{recommended.distanceM}</Mono> m ·{' '}
              <Mono>{recommended.walkMin}</Mono> min
            </span>
            <CrowdTag level={recommended.crowd} />
          </div>
          <Button full className="mt-3" onClick={() => navigateTo(exitTarget(recommended))}>
            <NavigationIcon className="w-4 h-4" strokeWidth={2} />
            Navigate to {recommended.name}
          </Button>
        </Card>

        <section aria-labelledby="all-exits">
          <h2
            id="all-exits"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            All exits
          </h2>
          <ul className="space-y-2">
            {exits.map((e) =>
            <li key={e.id}>
                <Card className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display font-semibold txt-base text-navy">{e.name}</p>
                      <p className="txt-sm text-muted">{e.side}</p>
                      <div className="mt-1.5">
                        <CrowdTag level={e.crowd} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Mono className="txt-lg font-semibold text-navy">{e.walkMin} min</Mono>
                      <p className="txt-xs text-muted">
                        <Mono>{e.distanceM}</Mono> m
                      </p>
                    </div>
                  </div>
                  <Button
                  full
                  variant="secondary"
                  className="mt-3"
                  onClick={() => navigateTo(exitTarget(e))}>
                  
                    Navigate
                  </Button>
                </Card>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>);

}