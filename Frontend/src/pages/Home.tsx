import React from 'react';
import {
  AccessibilityIcon,
  ArrowRightIcon,
  DoorOpenIcon,
  HeartPulseIcon,
  LayoutGridIcon,
  MapPinIcon,
  SearchIcon,
  TrainFrontIcon,
  TriangleAlertIcon,
  UsersIcon } from
'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import { Button, Card, CrowdTag, Mono, SectionLabel } from '../components/ui';
import { platformRoute } from '../data/station';

export function Home() {
  const {
    a11y,
    platform,
    platformChanged,
    festival,
    openOverlay,
    setTab,
    navigateTo,
    triggerPlatformChange
  } = useSetu();

  const quickActions = [
  { id: 'find', label: 'Find Me', Icon: MapPinIcon, onClick: () => openOverlay('findMe') },
  {
    id: 'platform',
    label: 'Find Platform',
    Icon: TrainFrontIcon,
    onClick: () => navigateTo(platformRoute(platform, a11y))
  },
  { id: 'coach', label: 'Coach Finder', Icon: LayoutGridIcon, onClick: () => setTab('coach') },
  { id: 'exit', label: 'Find Exit', Icon: DoorOpenIcon, onClick: () => openOverlay('exits') }];


  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <div className="bg-navy text-white px-4 pt-4 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold txt-lg leading-none tracking-tight">SETU</p>
            <p className="txt-sm text-white/70 mt-1">Dadar Railway Station</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 txt-xs font-medium">
            {a11y ?
            <>
                <AccessibilityIcon className="w-3.5 h-3.5" strokeWidth={2} /> Accessibility
              </> :

            'Normal Mode'
            }
          </span>
        </div>

        <h1 className="font-display font-semibold txt-xl mt-5">Where are you going?</h1>
        <button
          onClick={() => openOverlay('findMe')}
          className="tap mt-3 w-full bg-white rounded-lg px-3 flex items-center gap-2.5 text-left">
          
          <SearchIcon className="w-5 h-5 text-muted shrink-0" strokeWidth={2} />
          <span className="txt-sm text-muted truncate">
            Search platform, facility, exit or destination
          </span>
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {platformChanged &&
        <button
          onClick={() => navigateTo(platformRoute(platform, a11y))}
          className="w-full text-left rounded-xl border-l-4 border-amber bg-[#FDF3DC] border-y border-r border-y-[#f0e0bb] border-r-[#f0e0bb] p-3 flex items-start gap-2.5">
          
            <TriangleAlertIcon className="w-5 h-5 text-[#8a5b00] shrink-0" strokeWidth={2} />
            <span className="flex-1">
              <span className="block txt-sm font-semibold text-navy">
                Platform changed to <Mono>7</Mono>
              </span>
              <span className="block txt-sm text-[#8a5b00]">
                New route recalculated · 3 min walk
              </span>
            </span>
            <ArrowRightIcon className="w-4 h-4 text-[#8a5b00] mt-0.5" strokeWidth={2.2} />
          </button>
        }

        {/* Live journey */}
        <section aria-labelledby="live-journey">
          <div className="flex items-center justify-between mb-2">
            <h2
              id="live-journey"
              className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted">
              
              Live Journey
            </h2>
            <span className="inline-flex items-center gap-1.5 txt-xs font-medium text-setu-green">
              <span className="w-1.5 h-1.5 rounded-full bg-setu-green" aria-hidden="true" />
              ON TIME
            </span>
          </div>
          <Card className="overflow-hidden">
            <div className="p-4">
              <p className="font-display font-semibold txt-base">Mumbai Central → Thane</p>
              <p className="txt-sm text-muted">Fast local · 12 coaches</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div>
                  <p className="txt-xs text-muted uppercase tracking-wider">Platform</p>
                  <Mono className="txt-xl font-semibold text-navy">{platform}</Mono>
                </div>
                <div>
                  <p className="txt-xs text-muted uppercase tracking-wider">Departs</p>
                  <Mono className="txt-xl font-semibold text-navy">08:42</Mono>
                </div>
                <div>
                  <p className="txt-xs text-muted uppercase tracking-wider">Coach</p>
                  <Mono className="txt-xl font-semibold text-navy">D3</Mono>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              <Button variant="secondary" onClick={() => setTab('journey')}>
                View journey
              </Button>
              <Button onClick={() => navigateTo(platformRoute(platform, a11y))}>
                Navigate
              </Button>
            </div>
          </Card>
        </section>

        {/* Contextual crowd advisory */}
        {festival &&
        <Card className="p-3.5">
            <div className="flex items-start gap-2.5">
              <UsersIcon className="w-5 h-5 text-setu-red shrink-0 mt-0.5" strokeWidth={2} />
              <div className="flex-1">
                <p className="txt-sm font-semibold text-navy">High crowd detected</p>
                <p className="txt-sm text-muted">
                  Ganpati festival movement near the Main FOB and Exit B.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <CrowdTag level="Very High" />
                  <button
                  onClick={() => openOverlay('crowd')}
                  className="txt-sm font-semibold text-teal underline underline-offset-2">
                  
                    See live crowd
                  </button>
                </div>
              </div>
            </div>
          </Card>
        }

        {/* Quick actions */}
        <section aria-labelledby="quick-actions">
          <h2
            id="quick-actions"
            className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
            
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ id, label, Icon, onClick }) =>
            <button
              key={id}
              onClick={onClick}
              className="tap bg-white border hairline rounded-xl px-3 py-3 flex items-center gap-2.5 text-left hover:border-navy transition-colors duration-150 ease-out">
              
                <Icon className="w-5 h-5 text-navy shrink-0" strokeWidth={1.9} />
                <span className="txt-sm font-semibold text-navy">{label}</span>
              </button>
            )}
            <button
              onClick={() => openOverlay('medical')}
              className="tap col-span-2 rounded-xl border border-[#f0cccc] bg-[#FBE9E9] px-3 py-3 flex items-center gap-2.5 text-left">
              
              <HeartPulseIcon className="w-5 h-5 text-setu-red shrink-0" strokeWidth={2} />
              <span className="flex-1">
                <span className="block txt-sm font-semibold text-navy">I feel unwell</span>
                <span className="block txt-xs text-[#a13a3a]">
                  Nearest medical help from where you are standing
                </span>
              </span>
              <ArrowRightIcon className="w-4 h-4 text-setu-red" strokeWidth={2.2} />
            </button>
            <button
              onClick={() => openOverlay('more')}
              className="tap col-span-2 bg-white border hairline rounded-xl px-3 py-3 flex items-center gap-2.5 text-left">
              
              <LayoutGridIcon className="w-5 h-5 text-navy shrink-0" strokeWidth={1.9} />
              <span className="flex-1 txt-sm font-semibold text-navy">More</span>
              <span className="txt-xs text-muted">
                Washroom · Food · Parking · Police · Transport
              </span>
            </button>
          </div>
        </section>

        {!platformChanged &&
        <>
            <SectionLabel>Station updates</SectionLabel>
            <Card className="p-3.5">
              <p className="txt-sm text-navy">
                Platform announcements for your train are being monitored. SETU will
                recalculate your route if the platform changes.
              </p>
              <button
              onClick={triggerPlatformChange}
              className="txt-sm font-semibold text-teal underline underline-offset-2 mt-2">
              
                Simulate a platform change
              </button>
            </Card>
          </>
        }
      </div>
    </div>);

}