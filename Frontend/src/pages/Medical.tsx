import React from 'react';
import { AmbulanceIcon, MapPinIcon, NavigationIcon, PhoneIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, Mono, ScreenHeader, SectionLabel, StatTile } from '../components/ui';
import { StationMap } from '../components/StationMap';
import { hospitalTarget, hospitals } from '../data/station';

export function Medical() {
  const { closeOverlay, navigateTo, setMedical, setTab } = useSetu();
  const [showOthers, setShowOthers] = React.useState(false);
  const nearest = hospitals[0];

  React.useEffect(() => {
    setMedical(true);
    return () => setMedical(false);
  }, [setMedical]);

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-0">
      <ScreenHeader
        title="Medical assistance"
        subtitle="Your journey is paused"
        tone="red"
        onBack={closeOverlay}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5 min-h-0">
        <Card className="p-4" hover>
          <p className="txt-xs uppercase tracking-wider text-muted font-medium">Current location</p>
          <p className="font-display font-semibold txt-base text-navy flex items-center gap-1.5 mt-1">
            <MapPinIcon className="w-4 h-4 text-teal" strokeWidth={2.2} />
            Dadar Railway Station
          </p>
          <p className="txt-sm text-muted mt-0.5">Middle Concourse, near Dadar West</p>
        </Card>

        <Card className="border-2 border-setu-red overflow-hidden shadow-card">
          <div className="p-4">
            <p className="txt-xs font-semibold uppercase tracking-wider text-setu-red">
              Nearest hospital
            </p>
            <p className="font-display font-semibold txt-xl text-navy mt-1">{nearest.name}</p>
            <p className="txt-sm text-muted mt-0.5">{nearest.note}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <StatTile label="Distance" value={`${nearest.km} km`} />
              <StatTile label="By vehicle" value={`${nearest.driveMin} min`} />
              <StatTile label="Walking" value={`${nearest.walkMin} min`} />
            </div>
          </div>
          <div className="h-40 border-t hairline bg-[#EDF1F6]">
            <StationMap
              layers={{
                facilities: false,
                crowd: false,
                accessibility: false,
                exits: true,
                transport: true,
              }}
              route={hospitalTarget}
              compact
            />
          </div>
          <div className="p-3">
            <Button full variant="danger" onClick={() => navigateTo(hospitalTarget)}>
              <NavigationIcon className="w-4 h-4" strokeWidth={2} />
              Navigate to hospital
            </Button>
          </div>
        </Card>

        <div className="grid gap-2">
          <Button variant="secondary" full>
            <AmbulanceIcon className="w-4 h-4" strokeWidth={2} />
            Station medical assistance
          </Button>
          <Button variant="secondary" full onClick={() => setShowOthers((v) => !v)}>
            {showOthers ? 'Hide other hospitals' : 'View other hospitals'}
          </Button>
          <Button
            variant="ghost"
            full
            onClick={() => {
              closeOverlay();
              setTab('journey');
            }}
          >
            Back to journey
          </Button>
        </div>

        {showOthers && (
          <div>
            <SectionLabel>Other hospitals</SectionLabel>
            <ul className="space-y-2.5">
              {hospitals.slice(1).map((h) => (
                <li key={h.id}>
                  <Card className="p-3.5" hover>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display font-semibold txt-base text-navy">{h.name}</p>
                        <p className="txt-sm text-muted">{h.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Mono className="txt-base font-semibold text-navy">{h.km} km</Mono>
                        <p className="txt-xs text-muted">
                          <Mono>{h.driveMin}</Mono> min drive
                        </p>
                      </div>
                    </div>
                    <Button full variant="secondary" className="mt-3">
                      Navigate
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Card className="p-4 flex items-center gap-3" hover>
          <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
            <PhoneIcon className="w-5 h-5 text-navy" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="txt-sm font-semibold text-navy">Railway helpline 139</p>
            <p className="txt-sm text-muted">Medical emergencies inside the station</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
