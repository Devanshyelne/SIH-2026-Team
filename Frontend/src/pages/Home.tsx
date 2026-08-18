import React from 'react';

import {
  AccessibilityIcon,
  ArrowRightIcon,
  BotIcon,
  ChevronDownIcon,
  DoorOpenIcon,
  HeartPulseIcon,
  LayoutGridIcon,
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  SearchIcon,
  ShieldIcon,
  TrainFrontIcon,
  TriangleAlertIcon,
  UsersIcon,
  UtensilsIcon,
  WifiIcon,
} from 'lucide-react';

import { useSetu } from '../contexts/SetuContext';

import { AppFooter } from '../components/layout/AppFooter';
import {
  PageContainer,
  PageSection,
} from '../components/layout/PageContainer';

import {
  QuickLinkTile,
  ServiceTile,
} from '../components/layout/ServiceTile';

import {
  Badge,
  Button,
  Card,
  CrowdTag,
  Mono,
  StatTile,
  AlertBanner,
} from '../components/ui';

import {
  platformRoute,
  crowdAreas,
} from '../data/station';


// ------------------------------------------------------------
// FAQ
// ------------------------------------------------------------

const FAQ = [
  {
    q: 'How does SETU help me navigate Dadar station?',
    a: 'SETU provides indoor walking directions from your current location to platforms, coaches, exits and facilities. It recalculates routes when platforms change or crowd levels shift.',
  },
  {
    q: 'Can SETU work in accessibility mode?',
    a: 'Yes. Accessibility mode enables larger controls, voice guidance, step-free route priority, and higher contrast throughout the app.',
  },
  {
    q: 'How accurate is the live crowd information?',
    a: 'Crowd levels are estimated using anonymised device density, daily movement patterns, and historical event data. They update every 30 seconds.',
  },
  {
    q: 'What should I do in a medical emergency?',
    a: 'Use the Medical section to find station medical assistance and nearby emergency support.',
  },
];


// ------------------------------------------------------------
// FAQ ITEM
// ------------------------------------------------------------

function FaqItem({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="
          flex w-full
          items-center justify-between
          gap-4
          px-4 py-4
          text-left
          transition-colors
          hover:bg-slate-50
        "
      >
        <span className="text-sm font-bold text-[#12385B]">
          {q}
        </span>

        <ChevronDownIcon
          className={`
            h-4 w-4
            shrink-0
            text-slate-400
            transition-transform
            duration-200
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-500">
          {a}
        </div>
      )}
    </div>
  );
}


// ------------------------------------------------------------
// HOME
// ------------------------------------------------------------

export function Home() {
  const {
    a11y,
    platform,
    platformChanged,
    festival,
    openOverlay,
    setTab,
    navigateTo,
    triggerPlatformChange,
  } = useSetu();

  const [search, setSearch] = React.useState('');

  const avgCrowd = festival ? 'Very High' : 'Moderate';

  const handleSearch = () => {
    openOverlay('findMe');
  };

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-y-auto bg-[#F6F8FB]">
      
      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="bg-[#12385B] text-white">
        <PageContainer className="py-8 sm:py-10 lg:py-14">

          {/* Status */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            
            <Badge variant={a11y ? 'teal' : 'default'}>
              {a11y ? (
                <>
                  <AccessibilityIcon className="h-3.5 w-3.5" />
                  Accessibility Mode
                </>
              ) : (
                'Normal Mode'
              )}
            </Badge>

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-white/10
                px-3
                py-1.5
                text-[11px]
                font-bold
                text-white
              "
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Dadar Station Operational
            </span>
          </div>


          {/* Heading */}
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
              Smart Station Navigation
            </p>

            <h1 className="
              font-display
              text-3xl
              font-black
              leading-tight
              tracking-tight
              sm:text-4xl
              lg:text-5xl
            ">
              Navigate Dadar with confidence.
            </h1>

            <p className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-white/70
              sm:text-base
            ">
              Find platforms, coaches, exits and essential station
              facilities without getting lost.
            </p>
          </div>


          {/* ================================================== */}
          {/* SEARCH / NAVIGATION CARD */}
          {/* ================================================== */}

          <div className="
            relative
            z-10
            mt-7
            max-w-3xl
            rounded-2xl
            bg-white
            p-2
            shadow-[0_18px_45px_rgba(15,23,42,0.20)]
          ">
            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="
                flex
                min-w-0
                flex-1
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3.5
                py-3
              ">
                <SearchIcon
                  className="h-5 w-5 shrink-0 text-slate-400"
                  strokeWidth={2}
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Search platform, exit, coach or facility..."
                  aria-label="Search station"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                  "
                />
              </div>

              <Button
                size="lg"
                onClick={handleSearch}
                className="sm:px-7"
              >
                <NavigationIcon className="h-4 w-4" />
                Navigate
              </Button>
            </div>


            {/* Search suggestions */}
            <div className="flex flex-wrap gap-2 px-2 pb-1 pt-2">
              {[
                'Platform 5',
                'Exit B',
                'Washroom',
                'Food Court',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSearch(chip);
                    openOverlay('findMe');
                  }}
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-slate-600
                    transition-colors
                    hover:bg-slate-200
                    hover:text-[#12385B]
                  "
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>


          {/* Hero navigation links */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">

            <button
              type="button"
              onClick={() =>
                navigateTo(
                  platformRoute(platform, a11y)
                )
              }
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-white/85
                transition-colors
                hover:text-white
              "
            >
              <TrainFrontIcon className="h-4 w-4" />

              Go to Platform {platform}

              <ArrowRightIcon className="h-4 w-4" />
            </button>


            <button
              type="button"
              onClick={() => setTab('map')}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-white/85
                transition-colors
                hover:text-white
              "
            >
              <MapIcon className="h-4 w-4" />

              Open Station Map

              <ArrowRightIcon className="h-4 w-4" />
            </button>

          </div>
        </PageContainer>
      </section>


      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <PageContainer>


        {/* ================================================== */}
        {/* QUICK SERVICES */}
        {/* ================================================== */}

        <PageSection
          title="Station Services"
          subtitle="Everything you need inside Dadar"
        >
          <div className="
            flex
            gap-3
            overflow-x-auto
            px-1
            pb-2
            -mx-1
            no-scrollbar
          ">

            <QuickLinkTile
              label="Live Crowd"
              sublabel="Current station levels"
              icon={
                <UsersIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('crowd')}
            />

            <QuickLinkTile
              label="Find Exit"
              sublabel="Best route out"
              icon={
                <DoorOpenIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('exits')}
            />

            <QuickLinkTile
              label="Coach Finder"
              sublabel="Find your coach"
              icon={
                <TrainFrontIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => setTab('coach')}
            />

            <QuickLinkTile
              label="Medical"
              sublabel="Emergency assistance"
              icon={
                <HeartPulseIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('medical')}
            />

            <QuickLinkTile
              label="Station Map"
              sublabel="Indoor navigation"
              icon={
                <MapIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => setTab('map')}
            />

          </div>
        </PageSection>


        {/* ================================================== */}
        {/* PLATFORM ALERT */}
        {/* ================================================== */}

        {platformChanged && (
          <div className="mb-5">
            <AlertBanner
              variant="warning"
              icon={
                <TriangleAlertIcon
                  className="h-5 w-5 text-amber-700"
                />
              }
              onClick={() =>
                navigateTo(
                  platformRoute(platform, a11y)
                )
              }
              action={
                <ArrowRightIcon
                  className="h-4 w-4 text-amber-700"
                />
              }
            >
              <span className="block font-bold text-amber-900">
                Platform changed to <Mono>7</Mono>
              </span>

              <span className="mt-0.5 block text-amber-700">
                Your route has been recalculated.
              </span>
            </AlertBanner>
          </div>
        )}


        {/* ================================================== */}
        {/* LIVE STATUS + NAVIGATION */}
        {/* ================================================== */}

        <div className="
          grid
          gap-5
          py-2
          lg:grid-cols-5
        ">


          {/* ---------------------------------------------- */}
          {/* LIVE STATUS */}
          {/* ---------------------------------------------- */}

          <div className="lg:col-span-2">

            <PageSection
              title="Live Station Status"
              subtitle="Dadar · WR & CR"
            >
              <Card
                className="h-full p-5"
                hover
              >

                <div className="space-y-4">

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Overall crowd
                    </span>

                    <CrowdTag
                      level={
                        avgCrowd as
                          | 'Moderate'
                          | 'Very High'
                      }
                    />
                  </div>


                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Your platform
                    </span>

                    <Mono className="
                      text-lg
                      font-bold
                      text-[#12385B]
                    ">
                      {platform}
                    </Mono>
                  </div>


                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Train status
                    </span>

                    <Badge variant="success">
                      On Time
                    </Badge>
                  </div>


                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Station connectivity
                    </span>

                    <span className="
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      font-bold
                      text-[#12385B]
                    ">
                      <WifiIcon
                        className="h-4 w-4 text-[#0F766E]"
                      />

                      Available
                    </span>
                  </div>

                </div>


                <Button
                  variant="secondary"
                  full
                  className="mt-5"
                  onClick={() => openOverlay('crowd')}
                >
                  View crowd information
                </Button>

              </Card>
            </PageSection>

          </div>


          {/* ---------------------------------------------- */}
          {/* NAVIGATION CARD */}
          {/* ---------------------------------------------- */}

          <div className="lg:col-span-3">

            <PageSection
              title="Navigate the Station"
              subtitle="Get to your destination faster"
            >

              <Card
                className="overflow-hidden"
                hover
              >

                <div className="p-5">

                  <div className="
                    flex
                    items-start
                    gap-4
                  ">

                    <div className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#12385B]/5
                      text-[#12385B]
                    ">
                      <NavigationIcon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">

                      <p className="
                        font-display
                        text-lg
                        font-bold
                        text-[#12385B]
                      ">
                        Find your way around Dadar
                      </p>

                      <p className="
                        mt-1
                        max-w-xl
                        text-sm
                        leading-relaxed
                        text-slate-500
                      ">
                        Search for platforms, coaches, exits
                        and station facilities and get
                        step-by-step navigation.
                      </p>

                    </div>

                  </div>


                  <div className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-3
                  ">

                    <StatTile
                      label="Platform"
                      value={platform}
                      sub="Current route"
                    />

                    <StatTile
                      label="Mode"
                      value={a11y ? 'A11Y' : 'Standard'}
                      sub={
                        a11y
                          ? 'Accessible routing'
                          : 'Normal routing'
                      }
                    />

                    <StatTile
                      label="Crowd"
                      value={avgCrowd}
                      sub="Station status"
                    />

                  </div>

                </div>


                <div className="
                  grid
                  grid-cols-1
                  gap-2
                  border-t
                  border-slate-200
                  bg-slate-50/70
                  p-4
                  sm:grid-cols-3
                ">

                  <Button
                    variant="secondary"
                    onClick={() => openOverlay('findMe')}
                  >
                    Find destination
                  </Button>


                  <Button
                    variant="secondary"
                    onClick={() => setTab('map')}
                  >
                    Open map
                  </Button>


                  <Button
                    onClick={() =>
                      navigateTo(
                        platformRoute(
                          platform,
                          a11y
                        )
                      )
                    }
                  >
                    Navigate now
                  </Button>

                </div>

              </Card>

            </PageSection>

          </div>

        </div>


        {/* ================================================== */}
        {/* FESTIVAL / HIGH CROWD */}
        {/* ================================================== */}

        {festival && (
          <Card
            className="
              mb-2
              border-l-4
              border-l-[#C83E4D]
              p-5
            "
            hover
          >

            <div className="flex items-start gap-4">

              <div className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-rose-50
                text-[#C83E4D]
              ">
                <UsersIcon className="h-6 w-6" />
              </div>


              <div className="min-w-0 flex-1">

                <p className="
                  font-display
                  font-bold
                  text-[#12385B]
                ">
                  High crowd conditions
                </p>

                <p className="
                  mt-1
                  text-sm
                  leading-relaxed
                  text-slate-500
                ">
                  Crowd levels may be higher around major
                  station movement areas. SETU can help you
                  find alternate routes.
                </p>


                <div className="mt-3 flex flex-wrap gap-2">

                  <CrowdTag level="Very High" />

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openOverlay('crowd')}
                  >
                    View crowd dashboard
                  </Button>

                </div>

              </div>

            </div>

          </Card>
        )}


        {/* ================================================== */}
        {/* EXPLORE */}
        {/* ================================================== */}

        <PageSection
          title="Explore Station"
          subtitle="Find useful facilities inside Dadar"
        >

          <div className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          ">

            <ServiceTile
              title="Find Me"
              subtitle="Search platforms, facilities and exits"
              icon={
                <MapPinIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('findMe')}
              accent="teal"
            />


            <ServiceTile
              title="Food & Dining"
              subtitle="Restaurants, stalls and food courts"
              icon={
                <UtensilsIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('more')}
              accent="amber"
            />


            <ServiceTile
              title="All Facilities"
              subtitle="Washrooms, tickets, parking and more"
              icon={
                <LayoutGridIcon
                  className="h-5 w-5"
                  strokeWidth={1.9}
                />
              }
              onClick={() => openOverlay('more')}
              accent="navy"
            />


            <ServiceTile
              title="Medical Help"
              subtitle="Nearest hospital and station assistance"
              icon={
                <HeartPulseIcon
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              }
              onClick={() => openOverlay('medical')}
              accent="red"
            />

          </div>

        </PageSection>


        {/* ================================================== */}
        {/* CROWD OVERVIEW */}
        {/* ================================================== */}

        <PageSection
          title="Crowd Overview"
          subtitle="Current levels across key station areas"
        >

          <div className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          ">

            {crowdAreas
              .slice(0, 4)
              .map((area) => (
                <Card
                  key={area.id}
                  className="p-4"
                  hover
                >

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  ">

                    <p className="
                      text-sm
                      font-bold
                      text-[#12385B]
                    ">
                      {area.name}
                    </p>

                    <CrowdTag
                      level={area.level}
                    />

                  </div>

                  <p className="
                    mt-3
                    text-xs
                    leading-relaxed
                    text-slate-500
                  ">
                    {area.reason}
                  </p>

                </Card>
              ))}

          </div>

        </PageSection>


        {/* ================================================== */}
        {/* HOW SETU WORKS */}
        {/* ================================================== */}

        <PageSection
          title="How SETU Works"
          subtitle="Three simple steps to navigate the station"
        >

          <div className="
            grid
            gap-4
            sm:grid-cols-3
          ">

            {[
              {
                step: '01',
                title: 'Choose a destination',
                desc: 'Search for a platform, coach, exit or station facility.',
              },
              {
                step: '02',
                title: 'Get smart directions',
                desc: 'SETU helps you find an efficient route through the station.',
              },
              {
                step: '03',
                title: 'Navigate confidently',
                desc: 'Follow the route and use accessibility features when needed.',
              },
            ].map((item) => (

              <Card
                key={item.step}
                className="relative overflow-hidden p-5"
                hover
              >

                <Mono className="
                  text-4xl
                  font-black
                  text-[#12385B]/10
                ">
                  {item.step}
                </Mono>

                <h3 className="
                  mt-2
                  font-display
                  font-bold
                  text-[#12385B]
                ">
                  {item.title}
                </h3>

                <p className="
                  mt-1.5
                  text-sm
                  leading-relaxed
                  text-slate-500
                ">
                  {item.desc}
                </p>

              </Card>

            ))}

          </div>

        </PageSection>


        {/* ================================================== */}
        {/* ACCESSIBILITY */}
        {/* ================================================== */}

        <section className="py-6 sm:py-8">

          <div className="
            overflow-hidden
            rounded-3xl
            bg-[#12385B]
            p-6
            text-white
            sm:p-8
          ">

            <div className="
              flex
              flex-col
              items-start
              gap-5
              sm:flex-row
              sm:items-center
            ">

              <div className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#0F766E]
                text-white
              ">
                <AccessibilityIcon className="h-7 w-7" />
              </div>


              <div className="flex-1">

                <h2 className="
                  font-display
                  text-xl
                  font-bold
                ">
                  Built for accessibility
                </h2>

                <p className="
                  mt-1.5
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-white/65
                ">
                  Larger controls, accessibility-first
                  navigation and higher contrast help make
                  station travel easier for everyone.
                </p>

              </div>


              <Button
                variant="teal"
                onClick={() => setTab('profile')}
                className="shrink-0"
              >
                Accessibility settings
              </Button>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* AI ASSISTANT */}
        {/* ================================================== */}

        <section className="py-6 sm:py-8">

          <Card
            className="p-6 sm:p-8"
            hover
          >

            <div className="
              flex
              flex-col
              items-start
              gap-5
              sm:flex-row
              sm:items-center
            ">

              <div className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-amber-50
                text-amber-700
              ">
                <BotIcon className="h-7 w-7" />
              </div>


              <div className="flex-1">

                <h2 className="
                  font-display
                  text-xl
                  font-bold
                  text-[#12385B]
                ">
                  SETU AI Assistant
                </h2>

                <p className="
                  mt-1.5
                  max-w-2xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                ">
                  Ask about platforms, facilities, exits and
                  station navigation using the SETU assistant.
                </p>


                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-slate-600
                  ">
                    Where is the booking office?
                  </span>

                  <span className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-slate-600
                  ">
                    How do I reach Platform 5?
                  </span>

                </div>

              </div>

            </div>

          </Card>

        </section>


        {/* ================================================== */}
        {/* SAFETY */}
        {/* ================================================== */}

        <PageSection
          title="Safety & Emergency"
          subtitle="Important help when you need it"
        >

          <div className="
            grid
            gap-4
            sm:grid-cols-2
          ">

            <Card
              className="p-5"
              hover
            >

              <div className="flex items-start gap-4">

                <div className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-rose-50
                  text-[#C83E4D]
                ">
                  <HeartPulseIcon className="h-5 w-5" />
                </div>


                <div>

                  <p className="
                    font-display
                    font-bold
                    text-[#12385B]
                  ">
                    Medical emergency
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-relaxed
                    text-slate-500
                  ">
                    Find nearby station medical assistance
                    and emergency support.
                  </p>

                  <button
                    type="button"
                    onClick={() => openOverlay('medical')}
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-[#C83E4D]
                      hover:underline
                      underline-offset-2
                    "
                  >
                    Get medical help →
                  </button>

                </div>

              </div>

            </Card>


            <Card
              className="p-5"
              hover
            >

              <div className="flex items-start gap-4">

                <div className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#12385B]/5
                  text-[#12385B]
                ">
                  <ShieldIcon className="h-5 w-5" />
                </div>


                <div>

                  <p className="
                    font-display
                    font-bold
                    text-[#12385B]
                  ">
                    Railway Helpline 139
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-relaxed
                    text-slate-500
                  ">
                    For railway assistance, security concerns
                    and station support.
                  </p>

                  <p className="
                    mt-2
                    text-sm
                    font-bold
                    text-[#12385B]
                  ">
                    Available 24/7
                  </p>

                </div>

              </div>

            </Card>

          </div>

        </PageSection>


        {/* ================================================== */}
        {/* STATION UPDATES */}
        {/* ================================================== */}

        {!platformChanged && (

          <PageSection title="Station Updates">

            <Card
              className="p-5"
              hover
            >

              <div className="flex items-start gap-3">

                <div className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0F766E]/10
                  text-[#0F766E]
                ">
                  <TrainFrontIcon className="h-5 w-5" />
                </div>


                <div>

                  <p className="
                    text-sm
                    font-bold
                    text-[#12385B]
                  ">
                    Platform monitoring active
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-relaxed
                    text-slate-500
                  ">
                    SETU will update your navigation route
                    if the platform information changes.
                  </p>

                  <button
                    type="button"
                    onClick={triggerPlatformChange}
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-[#0F766E]
                      hover:underline
                      underline-offset-2
                    "
                  >
                    Simulate a platform change
                  </button>

                </div>

              </div>

            </Card>

          </PageSection>

        )}


        {/* ================================================== */}
        {/* FAQ */}
        {/* ================================================== */}

        <PageSection
          title="Frequently Asked Questions"
          subtitle="Learn how SETU helps inside Dadar station"
        >

          <div className="space-y-2">

            {FAQ.map((item) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
              />
            ))}

          </div>

        </PageSection>


      </PageContainer>


      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <AppFooter />

    </div>
  );
}