import React from 'react';
import { BellIcon, CircleDotIcon, MapPinIcon, TriangleAlertIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, Mono, ScreenHeader, SectionLabel } from '../components/ui';
import { platformRoute } from '../data/station';

export function Journey() {
  const { a11y, platform, platformChanged, navigateTo, setTab } = useSetu();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <ScreenHeader title="My Journey" subtitle="Today · 15 Aug" />

      <div className="px-4 py-4 space-y-4">
        <Card className="p-4">
          <ol className="relative">
            <li className="flex gap-3 pb-4">
              <div className="flex flex-col items-center">
                <CircleDotIcon className="w-4 h-4 text-teal" strokeWidth={2.4} />
                <span className="w-px flex-1 bg-slate-200 mt-1" aria-hidden="true" />
              </div>
              <div className="-mt-0.5">
                <p className="txt-xs uppercase tracking-wider text-muted">From</p>
                <p className="font-display font-semibold txt-base text-navy">Dadar</p>
                <p className="txt-sm text-muted">You are here · Middle Concourse</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex flex-col items-center">
                <MapPinIcon className="w-4 h-4 text-navy" strokeWidth={2.2} />
              </div>
              <div className="-mt-0.5">
                <p className="txt-xs uppercase tracking-wider text-muted">To</p>
                <p className="font-display font-semibold txt-base text-navy">Thane</p>
                <p className="txt-sm text-muted">Arrives 09:21 · 9 stops</p>
              </div>
            </li>
          </ol>
        </Card>

        {platformChanged &&
        <div className="rounded-xl border-l-4 border-amber bg-[#FDF3DC] border-y border-r border-y-[#f0e0bb] border-r-[#f0e0bb] p-3 flex items-start gap-2.5">
            <TriangleAlertIcon className="w-5 h-5 text-[#8a5b00] shrink-0" strokeWidth={2} />
            <p className="txt-sm text-navy">
              Platform changed <Mono className="font-semibold">5 → 7</Mono>. Route and coach
              position have been updated.
            </p>
          </div>
        }

        <section aria-labelledby="train-info">
          <h2
            id="train-info"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Train Information
          </h2>
          <Card>
            <div className="p-4">
              <p className="font-display font-semibold txt-base text-navy">
                Mumbai Central → Thane
              </p>
              <p className="txt-sm text-muted">Fast local · CR slow-fast corridor</p>

              <dl className="mt-4 grid grid-cols-2 gap-y-4">
                <div>
                  <dt className="txt-xs uppercase tracking-wider text-muted">Platform</dt>
                  <dd>
                    <Mono className="txt-2xl font-semibold text-navy">{platform}</Mono>
                  </dd>
                </div>
                <div>
                  <dt className="txt-xs uppercase tracking-wider text-muted">Departure</dt>
                  <dd>
                    <Mono className="txt-2xl font-semibold text-navy">08:42</Mono>
                  </dd>
                </div>
                <div>
                  <dt className="txt-xs uppercase tracking-wider text-muted">Coach</dt>
                  <dd>
                    <Mono className="txt-xl font-semibold text-navy">D3</Mono>
                    <span className="txt-sm text-muted ml-2">Second Class</span>
                  </dd>
                </div>
                <div>
                  <dt className="txt-xs uppercase tracking-wider text-muted">Status</dt>
                  <dd className="inline-flex items-center gap-1.5 txt-base font-semibold text-setu-green">
                    <span
                      className="w-2 h-2 rounded-full bg-setu-green"
                      aria-hidden="true" />
                    
                    ON TIME
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border-t hairline p-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => navigateTo(platformRoute(platform, a11y))}>
                View platform
              </Button>
              <Button variant="secondary" onClick={() => setTab('coach')}>
                View coach
              </Button>
              <Button
                className="col-span-2"
                onClick={() => navigateTo(platformRoute(platform, a11y))}>
                
                Navigate to Platform {platform}
              </Button>
            </div>
          </Card>
        </section>

        <section aria-labelledby="reminders">
          <h2
            id="reminders"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Reminders
          </h2>
          <Card className="divide-y divide-slate-200">
            {[
            { label: 'Leave for platform', detail: '08:34 · 8 min before departure', on: true },
            { label: 'Alight at Thane', detail: 'Alert 2 stations before', on: true },
            { label: 'Platform change alerts', detail: 'Always on for live journeys', on: true }].
            map((r) =>
            <div key={r.label} className="p-3.5 flex items-center gap-3">
                <BellIcon className="w-5 h-5 text-navy shrink-0" strokeWidth={1.9} />
                <div className="flex-1">
                  <p className="txt-sm font-semibold text-navy">{r.label}</p>
                  <p className="txt-sm text-muted">{r.detail}</p>
                </div>
                <span className="txt-xs font-semibold text-setu-green uppercase tracking-wide">
                  On
                </span>
              </div>
            )}
          </Card>
        </section>

        <SectionLabel>Journey history</SectionLabel>
        <Card className="p-3.5">
          <p className="txt-sm text-navy">Dadar → Andheri</p>
          <p className="txt-sm text-muted">Yesterday · Platform 3 · Coach D2</p>
        </Card>
      </div>
    </div>);

}