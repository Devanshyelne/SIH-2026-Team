import React from 'react';
import {
  AccessibilityIcon,
  ArrowRightIcon,
  CheckIcon,
  TrainFrontIcon,
} from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import type { Mode } from '../types/setu';
import { PageContainer } from '../components/layout/PageContainer';

const modes: {
  id: Mode;
  title: string;
  blurb: string;
  points: string[];
  Icon: typeof TrainFrontIcon;
}[] = [
  {
    id: 'normal',
    title: 'Normal Mode',
    blurb: 'Standard SETU experience for everyday travel.',
    points: ['Standard text size', 'Normal navigation', 'Regular station map', 'Standard controls'],
    Icon: TrainFrontIcon,
  },
  {
    id: 'accessibility',
    title: 'Accessibility Mode',
    blurb: 'Designed for easier navigation and comfort.',
    points: [
      'Larger controls',
      'Voice guidance',
      'Accessible routes',
      'Lift / ramp priority',
      'Higher contrast',
    ],
    Icon: AccessibilityIcon,
  },
];

export function ModeSelect() {
  const { mode, setMode, start } = useSetu();
  const [chosen, setChosen] = React.useState<Mode | null>(null);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar h-full bg-canvas">
      <div className="gradient-mesh text-white">
        <PageContainer className="py-12 sm:py-16 lg:py-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl bg-amber flex items-center justify-center shadow-soft">
              <TrainFrontIcon className="w-6 h-6 text-navy-dark" strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-display font-bold text-2xl sm:text-3xl tracking-tight">SETU</p>
              <p className="text-xs tracking-[0.16em] text-amber/90 font-medium mt-0.5">
                SMART STATION NAVIGATOR
              </p>
            </div>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight max-w-lg">
            Welcome to Dadar Railway Station
          </h1>
          <p className="txt-base sm:txt-lg text-white/70 mt-3 max-w-md leading-relaxed">
            Choose how you&apos;d like to navigate. You can change this anytime from your profile.
          </p>
        </PageContainer>
      </div>

      <PageContainer className="py-8 sm:py-10 -mt-6">
        <div className="bg-white rounded-2xl border hairline shadow-elevated p-5 sm:p-8">
          <h2 className="font-display font-semibold text-xl text-navy">Select your mode</h2>
          <p className="txt-sm text-muted mt-1">Optimised for your travel needs</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="SETU mode">
            {modes.map(({ id, title, blurb, points, Icon }) => {
              const selected = chosen === id;
              return (
                <div
                  key={id}
                  className={`rounded-2xl border-2 bg-white transition-all duration-200 ${
                    selected ? 'border-navy shadow-card' : 'border-border hover:border-slate-300'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          selected ? 'bg-navy text-white' : 'bg-slate-100 text-navy'
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.9} />
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display font-semibold text-navy">{title}</h3>
                          {selected && (
                            <span className="inline-flex items-center gap-1 txt-xs font-semibold text-setu-green">
                              <CheckIcon className="w-4 h-4" strokeWidth={2.6} />
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="txt-sm text-muted mt-0.5">{blurb}</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {points.map((p) => (
                        <li key={p} className="txt-sm text-navy/80 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-teal shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <button
                      role="radio"
                      aria-checked={selected}
                      onClick={() => { setChosen(id); setMode(id); }}
                      className={`tap mt-4 w-full rounded-xl txt-sm font-semibold transition-all duration-150 ${
                        selected
                          ? 'bg-slate-100 text-navy'
                          : 'bg-navy text-white hover:bg-navy-800'
                      }`}
                    >
                      {selected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            disabled={!chosen}
            onClick={start}
            className="tap mt-6 w-full sm:w-auto sm:min-w-[240px] rounded-xl bg-amber text-navy-dark font-display font-bold txt-base px-8 py-3.5 inline-flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 shadow-soft hover:brightness-95 transition-all duration-150 active:scale-[0.98]"
          >
            Start SETU
            <ArrowRightIcon className="w-5 h-5" strokeWidth={2.2} />
          </button>
          <p className="txt-xs text-muted mt-3">
            {chosen
              ? `Starting in ${mode === 'accessibility' ? 'Accessibility' : 'Normal'} Mode at Dadar Railway Station.`
              : 'Select a mode to continue.'}
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
