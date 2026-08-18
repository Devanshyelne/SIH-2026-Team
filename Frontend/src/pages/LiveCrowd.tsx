import React from "react";

import {
  AlertTriangleIcon,
  ArrowRightIcon,
  InfoIcon,
  MapPinIcon,
  RefreshCwIcon,
  RouteIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react";

import { useSetu } from "../contexts/SetuContext";

import {
  Button,
  Card,
  CrowdTag,
  Mono,
  ScreenHeader,
  SectionLabel,
  crowdColor,
} from "../components/ui";

import {
  alternateRoute,
  crowdAreas,
} from "../data/station";

// ------------------------------------------------------------
// Crowd bar widths
// ------------------------------------------------------------

const WIDTH: Record<string, string> = {
  Low: "w-1/4",
  Moderate: "w-2/4",
  High: "w-3/4",
  "Very High": "w-full",
};

// ------------------------------------------------------------
// Live Crowd
// ------------------------------------------------------------

export function LiveCrowd() {
  const {
    closeOverlay,
    takeAlternate,
    festival,
    emergency,
    setEmergency,
  } = useSetu();

  // ----------------------------------------------------------
  // Derived information from existing crowd data
  // ----------------------------------------------------------

  const veryHighCount = crowdAreas.filter(
    (area) => area.level === "Very High",
  ).length;

  const highCount = crowdAreas.filter(
    (area) => area.level === "High",
  ).length;

  const moderateCount = crowdAreas.filter(
    (area) => area.level === "Moderate",
  ).length;

  const lowCount = crowdAreas.filter(
    (area) => area.level === "Low",
  ).length;

  return (
    <div
      className="
        flex
        min-h-0
        flex-1
        flex-col
        bg-[#F6F8FB]
      "
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <ScreenHeader
        title="Live Crowd"
        subtitle="Dadar Railway Station"
        onBack={closeOverlay}
        right={
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              bg-emerald-50
              px-3
              py-1.5
              text-xs
              font-bold
              text-emerald-700
              sm:flex
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-emerald-500
              "
            />
            Live
          </div>
        }
      />

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          py-5
          no-scrollbar
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-6xl
          "
        >
          {/* ================================================== */}
          {/* PAGE INTRO */}
          {/* ================================================== */}

          <section className="mb-5">
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      inline-flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#12385B]/5
                      text-[#12385B]
                    "
                  >
                    <UsersIcon className="h-5 w-5" />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.14em]
                      text-slate-400
                    "
                  >
                    Station intelligence
                  </span>
                </div>

                <h1
                  className="
                    font-display
                    text-2xl
                    font-black
                    tracking-tight
                    text-[#12385B]
                    sm:text-3xl
                  "
                >
                  Know before you move.
                </h1>

                <p
                  className="
                    mt-1.5
                    max-w-xl
                    text-sm
                    leading-relaxed
                    text-slate-500
                  "
                >
                  Check crowd levels across key areas of Dadar
                  before choosing your route.
                </p>
              </div>

              {/* Updated indicator */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  self-start
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-2
                  shadow-[0_3px_12px_rgba(15,23,42,.04)]
                  sm:self-auto
                "
              >
                <RefreshCwIcon
                  className="h-4 w-4 text-[#0F766E]"
                />

                <div>
                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    Updated
                  </p>

                  <p
                    className="
                      text-xs
                      font-bold
                      text-[#12385B]
                    "
                  >
                    30 seconds ago
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* CROWD SUMMARY */}
          {/* ================================================== */}

          <section className="mb-5">
            <div
              className="
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-4
              "
            >
              {/* Very High */}

              <Card className="p-4" hover>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-rose-50
                      text-rose-600
                    "
                  >
                    <UsersIcon className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Areas
                  </span>
                </div>

                <p
                  className="
                    mt-4
                    font-mono
                    text-2xl
                    font-black
                    text-[#12385B]
                  "
                >
                  {veryHighCount}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  Very high
                </p>
              </Card>

              {/* High */}

              <Card className="p-4" hover>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-orange-50
                      text-orange-600
                    "
                  >
                    <UsersIcon className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Areas
                  </span>
                </div>

                <p
                  className="
                    mt-4
                    font-mono
                    text-2xl
                    font-black
                    text-[#12385B]
                  "
                >
                  {highCount}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  High
                </p>
              </Card>

              {/* Moderate */}

              <Card className="p-4" hover>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-amber-50
                      text-amber-600
                    "
                  >
                    <UsersIcon className="h-4 w-4" />
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    Areas
                  </span>
                </div>

                <p
                  className="
                    mt-4
                    font-mono
                    text-2xl
                    font-black
                    text-[#12385B]
                  "
                >
                  {moderateCount}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  Moderate
                </p>
              </Card>

              {/* Low */}

              <Card className="p-4" hover>
                <div
                  className="
                    flex
                    h-full
                    flex-col
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-emerald-50
                        text-emerald-600
                      "
                    >
                      <UsersIcon className="h-4 w-4" />
                    </span>

                    <span
                      className="
                        text-xs
                        font-bold
                        text-slate-400
                      "
                    >
                      Areas
                    </span>
                  </div>

                  <div className="mt-4">
                    <p
                      className="
                        font-mono
                        text-2xl
                        font-black
                        text-[#12385B]
                      "
                    >
                      {lowCount}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >
                      Low
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* ================================================== */}
          {/* FESTIVAL ALERT */}
          {/* ================================================== */}

          {festival && (
            <section className="mb-5">
              <Card
                className="
                  overflow-hidden
                  border-l-4
                  border-l-[#C83E4D]
                "
              >
                <div className="p-5">
                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-rose-50
                        text-[#C83E4D]
                      "
                    >
                      <AlertTriangleIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <h2
                          className="
                            font-display
                            font-bold
                            text-[#12385B]
                          "
                        >
                          High crowd conditions
                        </h2>

                        <span
                          className="
                            rounded-full
                            bg-rose-50
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-rose-700
                          "
                        >
                          Festival
                        </span>
                      </div>

                      <p
                        className="
                          mt-1.5
                          text-sm
                          leading-relaxed
                          text-slate-500
                        "
                      >
                        Large festival movement is expected
                        near the Main Foot Over Bridge and
                        Exit B.
                      </p>
                    </div>
                  </div>

                  {/* Alternate route */}

                  <div
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#0F766E]/10
                          text-[#0F766E]
                        "
                      >
                        <RouteIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.13em]
                            text-slate-400
                          "
                        >
                          Recommended alternative
                        </p>

                        <p
                          className="
                            mt-1
                            font-display
                            font-bold
                            text-[#12385B]
                          "
                        >
                          {alternateRoute.label}
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                        >
                          <Mono className="font-bold">
                            +1
                          </Mono>{" "}
                          min · lower crowd via the East
                          Foot Over Bridge
                        </p>
                      </div>
                    </div>

                    <Button
                      full
                      className="mt-4"
                      onClick={takeAlternate}
                    >
                      Show alternate route
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          )}

          {/* ================================================== */}
          {/* CROWD AREAS */}
          {/* ================================================== */}

          <section
            aria-labelledby="crowd-areas"
            className="mb-5"
          >
            <div
              className="
                mb-3
                flex
                items-end
                justify-between
                gap-4
              "
            >
              <div>
                <SectionLabel>
                  Live areas
                </SectionLabel>

                <h2
                  id="crowd-areas"
                  className="
                    font-display
                    text-lg
                    font-bold
                    text-[#12385B]
                  "
                >
                  Crowd by station area
                </h2>
              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-slate-400
                  sm:flex
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-500
                  "
                />

                Live data
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="divide-y divide-slate-200">
                {crowdAreas.map((area) => {
                  const c = crowdColor(area.level);

                  return (
                    <div
                      key={area.id}
                      className="
                        p-4
                        transition-colors
                        hover:bg-slate-50
                        sm:p-5
                      "
                    >
                      {/* Area heading */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-start
                            gap-3
                          "
                        >
                          <div
                            className="
                              mt-0.5
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-slate-100
                              text-slate-500
                            "
                          >
                            <MapPinIcon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                text-sm
                                font-bold
                                text-[#12385B]
                              "
                            >
                              {area.name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                text-slate-400
                              "
                            >
                              Station area
                            </p>
                          </div>
                        </div>

                        <CrowdTag level={area.level} />
                      </div>

                      {/* Crowd bar */}

                      <div className="mt-4">
                        <div
                          className="
                            mb-1.5
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <span
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Crowd level
                          </span>

                          <span
                            className={`
                              text-xs
                              font-bold
                              ${c.text}
                            `}
                          >
                            {area.level}
                          </span>
                        </div>

                        <div
                          className="
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-slate-100
                          "
                        >
                          <div
                            className={`
                              h-full
                              rounded-full
                              transition-all
                              duration-500
                              ${c.dot}
                              ${WIDTH[area.level]}
                            `}
                          />
                        </div>
                      </div>

                      {/* Reason */}

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-relaxed
                          text-slate-500
                        "
                      >
                        {area.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* ================================================== */}
          {/* CROWD INFORMATION */}
          {/* ================================================== */}

          <section className="mb-5">
            <Card className="p-5">
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#12385B]/5
                    text-[#12385B]
                  "
                >
                  <InfoIcon className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      font-display
                      font-bold
                      text-[#12385B]
                    "
                  >
                    How SETU estimates crowd levels
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Crowd estimates are based on station
                    movement and available crowd signals.
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-2
                  sm:grid-cols-3
                "
              >
                <div
                  className="
                    rounded-xl
                    bg-slate-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[#12385B]
                    "
                  >
                    Device density
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Anonymised device density inside the station.
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-slate-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[#12385B]
                    "
                  >
                    Movement patterns
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Daily passenger movement patterns.
                  </p>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-slate-50
                    p-3
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[#12385B]
                    "
                  >
                    Historical patterns
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Historical route and event patterns.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* ================================================== */}
          {/* EMERGENCY */}
          {/* ================================================== */}

          <section className="pb-6">
            <Card
              className={`
                overflow-hidden
                ${
                  emergency
                    ? "border-rose-200 bg-rose-50"
                    : ""
                }
              `}
            >
              <div className="p-5">
                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          emergency
                            ? "bg-rose-100 text-rose-600"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      <ShieldAlertIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <p
                        className="
                          font-display
                          font-bold
                          text-[#12385B]
                        "
                      >
                        Emergency crowd alert
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-relaxed
                          text-slate-500
                        "
                      >
                        {emergency
                          ? "Emergency congestion alert is currently active."
                          : "Use this control to simulate an emergency congestion condition."}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={
                      emergency ? "danger" : "secondary"
                    }
                    onClick={() =>
                      setEmergency(!emergency)
                    }
                  >
                    {emergency
                      ? "Clear alert"
                      : "Simulate alert"}
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}