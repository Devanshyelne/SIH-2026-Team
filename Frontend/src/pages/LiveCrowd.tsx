import React from 'react';
import { InfoIcon, UsersIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, Mono, ScreenHeader, SectionLabel, crowdColor } from '../components/ui';
import { alternateRoute, crowdAreas } from '../data/station';

const WIDTH: Record<string, string> = {
  Low: 'w-1/4',
  Moderate: 'w-2/4',
  High: 'w-3/4',
  'Very High': 'w-full',
};

export function LiveCrowd() {
  const { closeOverlay, takeAlternate, festival, emergency, setEmergency } = useSetu();

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-0">
      <ScreenHeader
        title="Live crowd"
        subtitle="Dadar · updated 30 seconds ago"
        onBack={closeOverlay}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5 min-h-0">
        {festival && (
          <Card className="p-4 border-l-4 border-l-setu-red">
            <p className="txt-sm font-semibold text-navy flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-setu-red" strokeWidth={2.2} />
              Ganpati festival crowd
            </p>
            <p className="txt-sm text-muted mt-1">
              Large festival movement near the Main Foot Over Bridge and Exit B.
            </p>
            <div className="mt-3 rounded-xl bg-canvas p-3.5 border hairline">
              <p className="txt-xs uppercase tracking-wider text-muted font-medium">
                Recommended alternative
              </p>
              <p className="font-display font-semibold txt-base text-navy mt-0.5">
                {alternateRoute.label}
              </p>
              <p className="txt-sm text-muted">
                <Mono>+1</Mono> min · lower crowd via the East Foot Over Bridge
              </p>
              <Button full className="mt-3" onClick={takeAlternate}>
                Show alternate route
              </Button>
            </div>
          </Card>
        )}

        <section aria-labelledby="areas">
          <SectionLabel>Areas</SectionLabel>
          <Card className="divide-y divide-border overflow-hidden">
            {crowdAreas.map((a) => {
              const c = crowdColor(a.level);
              return (
                <div key={a.id} className="p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="txt-sm font-semibold text-navy">{a.name}</p>
                    <span className={`txt-sm font-semibold ${c.text}`}>{a.level}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${c.dot} ${WIDTH[a.level]}`}
                    />
                  </div>
                  <p className="txt-sm text-muted mt-1.5">{a.reason}</p>
                </div>
              );
            })}
          </Card>
        </section>

        <Card className="p-4">
          <p className="txt-sm font-semibold text-navy flex items-center gap-2">
            <InfoIcon className="w-4 h-4 text-muted" strokeWidth={2} />
            How crowd levels are estimated
          </p>
          <ul className="txt-sm text-muted mt-2 space-y-1 list-disc pl-5">
            <li>Anonymised device density inside the station</li>
            <li>Daily passenger movement patterns</li>
            <li>Historical route and event patterns</li>
          </ul>
        </Card>

        <Button variant={emergency ? 'danger' : 'secondary'} full onClick={() => setEmergency(!emergency)}>
          {emergency ? 'Clear emergency congestion alert' : 'Simulate emergency congestion'}
        </Button>
      </div>
    </div>
  );
}
