import React from 'react';
import {
  AccessibilityIcon,
  BellIcon,
  FlagIcon,
  LanguagesIcon,
  LogOutIcon,
  ShieldIcon,
  TrainFrontIcon,
  UserIcon } from
'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, ScreenHeader } from '../components/ui';

export function Profile() {
  const { a11y, mode, setMode, reset, openOverlay } = useSetu();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <ScreenHeader title="Profile" />

      <div className="px-4 py-4 space-y-4">
        <Card className="p-4 flex items-center gap-3">
          <span
            className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center"
            aria-hidden="true">
            
            <UserIcon className="w-6 h-6" strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <p className="font-display font-semibold txt-lg text-navy">Pallavi Lotlikar</p>
            <p className="txt-sm text-muted">Mumbai · Western & Central lines</p>
          </div>
        </Card>

        <section aria-labelledby="current-mode">
          <h2
            id="current-mode"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Current mode
          </h2>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                a11y ? 'bg-teal text-white' : 'bg-slate-100 text-navy'}`
                }
                aria-hidden="true">
                
                {a11y ?
                <AccessibilityIcon className="w-5 h-5" strokeWidth={2} /> :

                <TrainFrontIcon className="w-5 h-5" strokeWidth={2} />
                }
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold txt-base text-navy">
                  {a11y ? 'Accessibility Mode' : 'Normal Mode'}
                </p>
                <p className="txt-sm text-muted">
                  {a11y ?
                  'Larger controls, voice-first guidance, lift and ramp priority.' :
                  'Standard text size, normal navigation and station map.'}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant={a11y ? 'secondary' : 'primary'}
                onClick={() => setMode('normal')}
                aria-pressed={!a11y}>
                
                Normal
              </Button>
              <Button
                variant={a11y ? 'primary' : 'secondary'}
                onClick={() => setMode('accessibility')}
                aria-pressed={a11y}>
                
                Accessibility
              </Button>
            </div>
          </Card>
        </section>

        <section aria-labelledby="prefs">
          <h2
            id="prefs"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Preferences
          </h2>
          <Card className="divide-y divide-slate-200">
            {[
            { Icon: BellIcon, label: 'Alerts', detail: 'Platform change, crowd, delays' },
            { Icon: LanguagesIcon, label: 'Language', detail: 'English · मराठी · हिन्दी' },
            { Icon: ShieldIcon, label: 'Emergency contacts', detail: '2 saved' }].
            map(({ Icon, label, detail }) =>
            <button
              key={label}
              className="tap w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50">
              
                <Icon className="w-5 h-5 text-navy shrink-0" strokeWidth={1.9} />
                <span className="flex-1">
                  <span className="block txt-sm font-semibold text-navy">{label}</span>
                  <span className="block txt-sm text-muted">{detail}</span>
                </span>
              </button>
            )}
            <button
              onClick={() => openOverlay('crowd')}
              className="tap w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50">
              
              <FlagIcon className="w-5 h-5 text-navy shrink-0" strokeWidth={1.9} />
              <span className="flex-1">
                <span className="block txt-sm font-semibold text-navy">Report a problem</span>
                <span className="block txt-sm text-muted">
                  Lift out of service, blocked route, wrong signage
                </span>
              </span>
            </button>
          </Card>
        </section>

        <Button variant="secondary" full onClick={reset}>
          <LogOutIcon className="w-4 h-4" strokeWidth={2} />
          Change mode and restart SETU
        </Button>

        <p className="txt-xs text-muted text-center pb-2">
          SETU · Smart Station Navigator · Prototype v3
        </p>
      </div>
    </div>);

}