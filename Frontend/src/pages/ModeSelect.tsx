import React from 'react';
import { AccessibilityIcon, ArrowRightIcon, CheckIcon, TrainFrontIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import type { Mode } from '../types/setu';

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
  blurb: 'Standard SETU experience.',
  points: ['Standard text size', 'Normal navigation', 'Regular station map', 'Standard controls'],
  Icon: TrainFrontIcon
},
{
  id: 'accessibility',
  title: 'Accessibility Mode',
  blurb: 'Designed for easier navigation.',
  points: [
  'Larger controls',
  'Voice guidance',
  'Accessible routes',
  'Lift / ramp priority',
  'Higher contrast'],

  Icon: AccessibilityIcon
}];


export function ModeSelect() {
  const { mode, setMode, start } = useSetu();
  const [chosen, setChosen] = React.useState<Mode | null>(null);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-navy-dark text-white">
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-lg bg-amber flex items-center justify-center"
            aria-hidden="true">
            
            <TrainFrontIcon className="w-5 h-5 text-navy-dark" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display font-bold txt-xl leading-none tracking-tight">SETU</p>
            <p className="txt-xs tracking-[0.16em] text-amber font-medium mt-1">
              SMART STATION NAVIGATOR
            </p>
          </div>
        </div>
        <p className="txt-base text-white/70 mt-5 max-w-[30ch]">
          Navigate the station. Find your way. Travel smarter.
        </p>
      </div>

      <div className="bg-canvas text-navy rounded-t-2xl px-5 pt-6 pb-8 min-h-[62%]">
        <h1 className="font-display font-semibold txt-lg">How would you like to use SETU?</h1>
        <p className="txt-sm text-muted mt-1">
          You can change this later from your profile.
        </p>

        <div className="mt-5 space-y-3" role="radiogroup" aria-label="SETU mode">
          {modes.map(({ id, title, blurb, points, Icon }) => {
            const selected = chosen === id;
            return (
              <div
                key={id}
                className={`rounded-xl border-2 bg-white transition-colors duration-150 ease-out ${
                selected ? 'border-navy' : 'border-slate-200'}`
                }>
                
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      selected ? 'bg-navy text-white' : 'bg-slate-100 text-navy'}`
                      }
                      aria-hidden="true">
                      
                      <Icon className="w-5 h-5" strokeWidth={1.9} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-display font-semibold txt-base">{title}</h2>
                        {selected &&
                        <span className="inline-flex items-center gap-1 txt-xs font-semibold text-setu-green">
                            <CheckIcon className="w-4 h-4" strokeWidth={2.6} /> SELECTED
                          </span>
                        }
                      </div>
                      <p className="txt-sm text-muted">{blurb}</p>
                    </div>
                  </div>

                  <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {points.map((p) =>
                    <li key={p} className="txt-sm text-navy/80 flex items-start gap-1.5">
                        <span
                        className="w-1 h-1 rounded-full bg-muted mt-2 shrink-0"
                        aria-hidden="true" />
                      
                        {p}
                      </li>
                    )}
                  </ul>

                  <button
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setChosen(id);
                      setMode(id);
                    }}
                    className={`tap mt-4 w-full rounded-lg txt-sm font-semibold tracking-wide transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                    selected ?
                    'bg-slate-100 text-navy' :
                    'bg-navy text-white hover:bg-navy-dark'}`
                    }>
                    
                    {selected ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>
              </div>);

          })}
        </div>

        <button
          disabled={!chosen}
          onClick={start}
          className="tap mt-6 w-full rounded-lg bg-amber text-navy-dark font-display font-bold txt-base tracking-wide inline-flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-navy">
          
          START SETU
          <ArrowRightIcon className="w-5 h-5" strokeWidth={2.2} />
        </button>
        <p className="txt-xs text-muted text-center mt-3">
          {chosen ?
          `Starting in ${mode === 'accessibility' ? 'Accessibility' : 'Normal'} Mode at Dadar Railway Station.` :
          'Select a mode to continue.'}
        </p>
      </div>
    </div>);

}