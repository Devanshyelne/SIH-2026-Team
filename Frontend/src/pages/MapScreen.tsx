import React from 'react';
import {
  CrosshairIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
  TriangleAlertIcon,
  Volume2Icon,
  XIcon } from
'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { StationMap } from '../components/StationMap';
import { Button, Card, CrowdTag, Mono } from '../components/ui';
import {
  alternateRoute,
  emergencyRoutes,
  exitTarget,
  exits,
  platformRoute } from
'../data/station';
import type { MapLayer, NavTarget } from '../types/setu';

const LAYERS: {id: MapLayer;label: string;}[] = [
{ id: 'facilities', label: 'Facilities' },
{ id: 'crowd', label: 'Crowd' },
{ id: 'accessibility', label: 'Accessibility' },
{ id: 'exits', label: 'Exits' },
{ id: 'transport', label: 'Transport' }];


export function MapScreen() {
  const {
    a11y,
    layers,
    toggleLayer,
    nav,
    platform,
    festival,
    emergency,
    navigateTo,
    startNavigation,
    endNavigation,
    togglePause,
    takeAlternate
  } = useSetu();
  const [routePicker, setRoutePicker] = React.useState(false);
  const [voicePing, setVoicePing] = React.useState(0);

  React.useEffect(() => {
    if (voicePing === 0) return;
    const t = window.setTimeout(() => setVoicePing(0), 2600);
    return () => window.clearTimeout(t);
  }, [voicePing]);

  const target = nav.target;
  const step = target ? target.steps[Math.min(nav.stepIndex, target.steps.length - 1)] : '';
  const crowdedRoute =
  festival && !nav.usingAlternate && target?.id.startsWith('platform') && !a11y;

  return (
    <div className="flex-1 relative bg-[#EDF1F6] overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-20 bg-white/95 backdrop-blur-[2px] border-b hairline">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold txt-base text-navy">Station Map</h1>
            <p className="txt-xs text-muted">Dadar · WR & CR · Indoor</p>
          </div>
          <span className="txt-xs text-muted">
            Level: <Mono className="font-semibold text-navy">Concourse</Mono>
          </span>
        </div>
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {LAYERS.map((l) => {
            const on = layers[l.id];
            return (
              <button
                key={l.id}
                aria-pressed={on}
                onClick={() => toggleLayer(l.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 txt-xs font-semibold border transition-colors duration-150 ease-out ${
                on ?
                'bg-navy text-white border-navy' :
                'bg-white text-muted border-slate-300 hover:text-navy'}`
                }>
                
                {l.label}
              </button>);

          })}
        </div>
      </div>

      <div className="absolute inset-0 pt-[92px] pb-[210px] px-2">
        <StationMap
          layers={layers}
          route={target}
          highlightPlatform={target?.id.startsWith('platform') ? platform : undefined} />
        
      </div>

      <button
        aria-label="Recenter map"
        className="absolute right-3 bottom-[228px] z-20 w-11 h-11 rounded-full bg-white border hairline shadow-sm flex items-center justify-center text-navy">
        
        <CrosshairIcon className="w-5 h-5" strokeWidth={1.9} />
      </button>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-white border-t hairline rounded-t-2xl shadow-[0_-6px_24px_rgba(16,42,67,0.10)]">
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="w-9 h-1 rounded-full bg-slate-300" />
        </div>

        {!target &&
        <div className="p-4">
            <p className="txt-sm text-muted">Choose a destination to get walking directions.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button onClick={() => navigateTo(platformRoute(platform, a11y))}>
                Platform {platform}
              </Button>
              <Button variant="secondary" onClick={() => navigateTo(exitTarget(exits[1]))}>
                Nearest exit
              </Button>
            </div>
          </div>
        }

        {target && !nav.active &&
        <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display font-semibold txt-lg text-navy truncate">
                  {target.label}
                </h2>
                <p className="txt-sm text-muted truncate">{target.sublabel}</p>
              </div>
              <div className="text-right shrink-0">
                <Mono className="txt-xl font-semibold text-navy">{target.minutes} min</Mono>
                <p className="txt-xs text-muted">
                  <Mono>{target.distanceM}</Mono> m
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <CrowdTag level={target.crowd} />
              {target.accessible &&
            <span className="txt-xs font-medium text-teal">Step-free route</span>
            }
            </div>

            {crowdedRoute &&
          <div className="mt-3 rounded-lg bg-[#FBE9E9] border border-[#f0cccc] p-3">
                <p className="txt-sm font-semibold text-navy flex items-center gap-1.5">
                  <TriangleAlertIcon className="w-4 h-4 text-setu-red" strokeWidth={2.2} />
                  High crowd detected ahead
                </p>
                <p className="txt-sm text-[#a13a3a] mt-0.5">
                  Large festival crowd near the Main FOB and Exit B.
                </p>
                <button
              onClick={() => setRoutePicker(true)}
              className="txt-sm font-semibold text-navy underline underline-offset-2 mt-1.5">
              
                  Show alternative routes
                </button>
              </div>
          }

            <ol className="mt-3 space-y-1.5">
              {target.steps.slice(0, 3).map((s, i) =>
            <li key={s} className="flex gap-2 txt-sm text-navy/85">
                  <Mono className="text-muted">{i + 1}</Mono>
                  {s}
                </li>
            )}
            </ol>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button className="col-span-3" onClick={startNavigation}>
                Start navigation
              </Button>
              <Button variant="secondary" onClick={() => setRoutePicker(true)}>
                Change route
              </Button>
              <Button variant="secondary">Recenter</Button>
              <Button variant="ghost" onClick={endNavigation}>
                End
              </Button>
            </div>
          </div>
        }

        {target && nav.active &&
        <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 txt-xs font-semibold uppercase tracking-wider text-teal">
                <Volume2Icon className="w-4 h-4" strokeWidth={2.2} />
                Voice navigation active
              </span>
              <span className="txt-xs text-muted">
                Step <Mono>{nav.stepIndex + 1}</Mono>/<Mono>{target.steps.length}</Mono>
              </span>
            </div>

            <div className="mt-2 rounded-lg bg-navy text-white p-3.5">
              <p className="txt-xs uppercase tracking-wider text-white/60">
                {target.label} · <Mono>{target.minutes}</Mono> min ·{' '}
                <Mono>{target.distanceM}</Mono> m
              </p>
              <p
              key={`${nav.stepIndex}-${voicePing}`}
              className={`${a11y ? 'txt-xl' : 'txt-lg'} font-display font-semibold mt-1`}>
              
                “{step}”
              </p>
              <div className="mt-3 h-1 rounded bg-white/20 overflow-hidden">
                <div
                className="h-full bg-amber transition-[width] duration-500 ease-out"
                style={{
                  width: `${(nav.stepIndex + 1) / target.steps.length * 100}%`
                }} />
              
              </div>
            </div>

            <div className={`mt-3 grid grid-cols-3 gap-2 ${a11y ? 'gap-2.5' : ''}`}>
              <Button variant="secondary" onClick={() => setVoicePing((v) => v + 1)}>
                <RotateCcwIcon className="w-4 h-4" strokeWidth={2} />
                Repeat
              </Button>
              <Button variant="secondary" onClick={togglePause}>
                {nav.paused ?
              <PlayIcon className="w-4 h-4" strokeWidth={2} /> :

              <PauseIcon className="w-4 h-4" strokeWidth={2} />
              }
                {nav.paused ? 'Resume' : 'Pause'}
              </Button>
              <Button variant="danger" onClick={endNavigation}>
                <SquareIcon className="w-3.5 h-3.5" strokeWidth={2.4} />
                Stop
              </Button>
            </div>
            <p className="txt-xs text-muted mt-2 text-center" aria-live="polite">
              {voicePing > 0 ?
            'Repeating the current instruction.' :
            'Spoken guidance is simulated in this prototype.'}
            </p>
          </div>
        }
      </div>

      {/* Route comparison sheet */}
      {routePicker &&
      <div className="absolute inset-0 z-40 flex items-end">
          <button
          className="absolute inset-0 bg-navy-dark/40"
          aria-label="Close route options"
          onClick={() => setRoutePicker(false)} />
        
          <div className="relative w-full bg-white rounded-t-2xl max-h-[80%] overflow-y-auto no-scrollbar">
            <div className="sticky top-0 bg-white px-4 pt-4 pb-2 flex items-start justify-between border-b hairline">
              <div>
                <h2 className="font-display font-semibold txt-lg text-navy">
                  {emergency ? 'Emergency route update' : 'Choose your route'}
                </h2>
                <p className="txt-sm text-muted">
                  {emergency ?
                'High crowd near Platform 5. Routes are spread to reduce congestion.' :
                'Compare walking time against crowd level.'}
                </p>
              </div>
              <button
              onClick={() => setRoutePicker(false)}
              aria-label="Close"
              className="tap w-9 flex items-center justify-center text-muted">
              
                <XIcon className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <div className="p-4 space-y-2.5">
              {(emergency ?
            emergencyRoutes :
            [target ?? platformRoute(platform, a11y), alternateRoute] as NavTarget[]).
            map((r, i) => {
              const recommended = emergency ? r.crowd === 'Low' && i === 0 : r.id.includes('alt');
              return (
                <Card
                  key={r.id}
                  className={`p-3.5 ${recommended ? 'border-2 border-setu-green' : ''}`}>
                  
                    {recommended &&
                  <p className="txt-xs font-semibold uppercase tracking-wider text-setu-green mb-1">
                        Recommended
                      </p>
                  }
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display font-semibold txt-base text-navy truncate">
                          {r.label}
                        </p>
                        <p className="txt-sm text-muted truncate">{r.sublabel}</p>
                        <div className="mt-1.5">
                          <CrowdTag level={r.crowd} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Mono className="txt-lg font-semibold text-navy">{r.minutes} min</Mono>
                        <p className="txt-xs text-muted">
                          <Mono>{r.distanceM}</Mono> m
                        </p>
                      </div>
                    </div>
                    <Button
                    full
                    className="mt-3"
                    variant={recommended ? 'primary' : 'secondary'}
                    onClick={() => {
                      if (r.id === alternateRoute.id) takeAlternate();else
                      navigateTo(r);
                      setRoutePicker(false);
                    }}>
                    
                      Take this route
                    </Button>
                  </Card>);

            })}
              <p className="txt-xs text-muted">
                Voice: “High crowd detected ahead. A less crowded route is available.”
              </p>
            </div>
          </div>
        </div>
      }
    </div>);

}