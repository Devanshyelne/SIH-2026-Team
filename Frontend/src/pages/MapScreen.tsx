import React from "react";
import {
  CrosshairIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
  TriangleAlertIcon,
  Volume2Icon,
  XIcon,
} from "lucide-react";

import { useSetu } from "../contexts/SetuContext";
import { StationMap } from "../components/StationMap";
import { Button, Card, CrowdTag, Mono } from "../components/ui";

import {
  alternateRoute,
  emergencyRoutes,
  exitTarget,
  exits,
  platformRoute,
} from "../data/station";

import type { MapLayer, NavTarget } from "../types/setu";

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: "facilities", label: "Facilities" },
  { id: "crowd", label: "Crowd" },
  { id: "accessibility", label: "Accessibility" },
  { id: "exits", label: "Exits" },
  { id: "transport", label: "Transport" },
];

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
    takeAlternate,
  } = useSetu();

  const [routePicker, setRoutePicker] = React.useState(false);
  const [voicePing, setVoicePing] = React.useState(0);

  React.useEffect(() => {
    if (voicePing === 0) return;

    const timer = window.setTimeout(() => {
      setVoicePing(0);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [voicePing]);

  const target = nav.target;

  const step = target
    ? target.steps[Math.min(nav.stepIndex, target.steps.length - 1)]
    : "";

  const crowdedRoute =
    festival &&
    !nav.usingAlternate &&
    target?.id.startsWith("platform") &&
    !a11y;

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#EDF1F6]">
      {/* =========================================================
          TOP MAP HEADER
      ========================================================== */}
      <div className="absolute inset-x-0 top-0 z-20 bg-white/95 backdrop-blur-sm border-b hairline">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-6">
          <div className="flex min-h-[56px] items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <h1 className="font-display font-semibold txt-base text-navy truncate">
                Station Map
              </h1>

              <p className="txt-xs text-muted truncate">
                Dadar · WR & CR · Indoor
              </p>
            </div>

            <span className="hidden xs:block sm:block shrink-0 txt-xs text-muted">
              Level:{" "}
              <Mono className="font-semibold text-navy">
                Concourse
              </Mono>
            </span>
          </div>

          {/* Layer buttons */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
            {LAYERS.map((layer) => {
              const enabled = layers[layer.id];

              return (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={enabled}
                  onClick={() => toggleLayer(layer.id)}
                  className={`tap shrink-0 rounded-full border px-3 py-1.5 txt-xs font-semibold transition-colors ${
                    enabled
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-muted border-slate-300 hover:text-navy"
                  }`}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          MAP AREA
          Uses dynamic positioning instead of fixed 210px padding.
      ========================================================== */}
      <div
        className="
          absolute inset-0
          pt-[100px]
          pb-[clamp(250px,42vh,390px)]
          px-1.5
          sm:px-2
        "
      >
        <div className="relative h-full w-full overflow-hidden rounded-none sm:rounded-xl">
          <StationMap
            layers={layers}
            route={target}
            highlightPlatform={
              target?.id.startsWith("platform")
                ? platform
                : undefined
            }
          />
        </div>
      </div>

      {/* =========================================================
          RECENTER BUTTON
      ========================================================== */}
      <button
        type="button"
        aria-label="Recenter map"
        className="
          absolute
          right-3 sm:right-5
          bottom-[clamp(255px,43vh,395px)]
          z-20
          flex
          h-11 w-11
          items-center justify-center
          rounded-full
          bg-white
          border
          hairline
          shadow-md
          text-navy
          active:scale-95
          transition-transform
        "
      >
        <CrosshairIcon
          className="h-5 w-5"
          strokeWidth={1.9}
        />
      </button>

      {/* =========================================================
          MAIN BOTTOM SHEET
      ========================================================== */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-30
          max-h-[calc(100%-96px)]
          overflow-hidden
          rounded-t-2xl
          border-t
          hairline
          bg-white
          shadow-[0_-6px_24px_rgba(16,42,67,0.10)]
        "
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-2.5"
          aria-hidden="true"
        >
          <span className="h-1 w-9 rounded-full bg-slate-300" />
        </div>

        {/* =====================================================
            NO DESTINATION
        ====================================================== */}
        {!target && (
          <div className="mx-auto w-full max-w-3xl p-3 sm:p-4">
            <p className="txt-sm text-muted">
              Choose a destination to get walking directions.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                onClick={() =>
                  navigateTo(
                    platformRoute(platform, a11y)
                  )
                }
              >
                Platform {platform}
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  navigateTo(
                    exitTarget(exits[1])
                  )
                }
              >
                Nearest exit
              </Button>
            </div>
          </div>
        )}

        {/* =====================================================
            DESTINATION SELECTED / NAVIGATION NOT STARTED
        ====================================================== */}
        {target && !nav.active && (
          <div className="mx-auto max-h-[min(48vh,420px)] w-full max-w-3xl overflow-y-auto no-scrollbar p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-display font-semibold txt-lg text-navy truncate">
                  {target.label}
                </h2>

                <p className="txt-sm text-muted truncate">
                  {target.sublabel}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <Mono className="txt-xl font-semibold text-navy">
                  {target.minutes} min
                </Mono>

                <p className="txt-xs text-muted">
                  <Mono>{target.distanceM}</Mono> m
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CrowdTag level={target.crowd} />

              {target.accessible && (
                <span className="txt-xs font-medium text-teal">
                  Step-free route
                </span>
              )}
            </div>

            {/* Crowd warning */}
            {crowdedRoute && (
              <div className="mt-3 rounded-lg border border-[#f0cccc] bg-[#FBE9E9] p-3">
                <p className="flex items-center gap-1.5 txt-sm font-semibold text-navy">
                  <TriangleAlertIcon
                    className="h-4 w-4 shrink-0 text-setu-red"
                    strokeWidth={2.2}
                  />

                  High crowd detected ahead
                </p>

                <p className="mt-0.5 txt-sm text-[#a13a3a]">
                  Large festival crowd near the Main FOB and Exit B.
                </p>

                <button
                  type="button"
                  onClick={() => setRoutePicker(true)}
                  className="mt-1.5 txt-sm font-semibold text-navy underline underline-offset-2"
                >
                  Show alternative routes
                </button>
              </div>
            )}

            {/* Steps */}
            <ol className="mt-3 space-y-1.5">
              {target.steps.slice(0, 3).map((instruction, index) => (
                <li
                  key={instruction}
                  className="flex gap-2 txt-sm text-navy/85"
                >
                  <Mono className="shrink-0 text-muted">
                    {index + 1}
                  </Mono>

                  <span>{instruction}</span>
                </li>
              ))}
            </ol>

            {/* Actions */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Button
                className="col-span-2 sm:col-span-3"
                onClick={startNavigation}
              >
                Start navigation
              </Button>

              <Button
                variant="secondary"
                onClick={() => setRoutePicker(true)}
              >
                Change route
              </Button>

              <Button variant="secondary">
                Recenter
              </Button>

              <Button
                variant="ghost"
                onClick={endNavigation}
              >
                End
              </Button>
            </div>
          </div>
        )}

        {/* =====================================================
            ACTIVE NAVIGATION
        ====================================================== */}
        {target && nav.active && (
          <div className="mx-auto max-h-[min(45vh,390px)] w-full max-w-3xl overflow-y-auto no-scrollbar p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex min-w-0 items-center gap-2 txt-xs font-semibold uppercase tracking-wider text-teal">
                <Volume2Icon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2.2}
                />

                <span className="truncate">
                  Voice navigation active
                </span>
              </span>

              <span className="shrink-0 txt-xs text-muted">
                Step{" "}
                <Mono>{nav.stepIndex + 1}</Mono>
                /
                <Mono>{target.steps.length}</Mono>
              </span>
            </div>

            {/* Current instruction */}
            <div className="mt-2 rounded-lg bg-navy p-3.5 text-white">
              <p className="txt-xs uppercase tracking-wider text-white/60">
                {target.label} ·{" "}
                <Mono>{target.minutes}</Mono> min ·{" "}
                <Mono>{target.distanceM}</Mono> m
              </p>

              <p
                key={`${nav.stepIndex}-${voicePing}`}
                className={`${
                  a11y ? "txt-xl" : "txt-lg"
                } mt-1 font-display font-semibold`}
              >
                “{step}”
              </p>

              <div className="mt-3 h-1 overflow-hidden rounded bg-white/20">
                <div
                  className="h-full bg-amber transition-[width] duration-500 ease-out"
                  style={{
                    width: `${
                      ((nav.stepIndex + 1) /
                        target.steps.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Navigation controls */}
            <div
              className={`mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 ${
                a11y ? "sm:gap-2.5" : ""
              }`}
            >
              <Button
                variant="secondary"
                onClick={() =>
                  setVoicePing((value) => value + 1)
                }
              >
                <RotateCcwIcon
                  className="h-4 w-4"
                  strokeWidth={2}
                />
                Repeat
              </Button>

              <Button
                variant="secondary"
                onClick={togglePause}
              >
                {nav.paused ? (
                  <PlayIcon
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                ) : (
                  <PauseIcon
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                )}

                {nav.paused ? "Resume" : "Pause"}
              </Button>

              <Button
                variant="danger"
                onClick={endNavigation}
              >
                <SquareIcon
                  className="h-3.5 w-3.5"
                  strokeWidth={2.4}
                />

                Stop
              </Button>
            </div>

            <p
              className="mt-2 text-center txt-xs text-muted"
              aria-live="polite"
            >
              {voicePing > 0
                ? "Repeating the current instruction."
                : "Spoken guidance is simulated in this prototype."}
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          ROUTE COMPARISON SHEET
      ========================================================== */}
      {routePicker && (
        <div className="absolute inset-0 z-40 flex items-end">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-navy-dark/40"
            aria-label="Close route options"
            onClick={() => setRoutePicker(false)}
          />

          {/* Sheet */}
          <div
            className="
              relative
              w-full
              max-h-[88dvh]
              overflow-y-auto
              no-scrollbar
              rounded-t-2xl
              bg-white
              shadow-2xl
            "
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b hairline bg-white px-3 pb-2 pt-4 sm:px-4">
              <div className="min-w-0">
                <h2 className="font-display font-semibold txt-lg text-navy">
                  {emergency
                    ? "Emergency route update"
                    : "Choose your route"}
                </h2>

                <p className="mt-0.5 txt-sm text-muted">
                  {emergency
                    ? "High crowd near Platform 5. Routes are spread to reduce congestion."
                    : "Compare walking time against crowd level."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRoutePicker(false)}
                aria-label="Close"
                className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-slate-100"
              >
                <XIcon
                  className="h-5 w-5"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Route cards */}
            <div className="mx-auto w-full max-w-3xl space-y-2.5 p-3 sm:p-4">
              {(
                emergency
                  ? emergencyRoutes
                  : [
                      target ??
                        platformRoute(platform, a11y),
                      alternateRoute,
                    ]
              ).map((route, index) => {
                const r = route as NavTarget;

                const recommended = emergency
                  ? r.crowd === "Low" && index === 0
                  : r.id.includes("alt");

                return (
                  <Card
                    key={r.id}
                    className={`p-3.5 ${
                      recommended
                        ? "border-2 border-setu-green"
                        : ""
                    }`}
                  >
                    {recommended && (
                      <p className="mb-1 txt-xs font-semibold uppercase tracking-wider text-setu-green">
                        Recommended
                      </p>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display font-semibold txt-base text-navy truncate">
                          {r.label}
                        </p>

                        <p className="txt-sm text-muted truncate">
                          {r.sublabel}
                        </p>

                        <div className="mt-1.5">
                          <CrowdTag level={r.crowd} />
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <Mono className="txt-lg font-semibold text-navy">
                          {r.minutes} min
                        </Mono>

                        <p className="txt-xs text-muted">
                          <Mono>{r.distanceM}</Mono> m
                        </p>
                      </div>
                    </div>

                    <Button
                      full
                      className="mt-3"
                      variant={
                        recommended
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => {
                        if (r.id === alternateRoute.id) {
                          takeAlternate();
                        } else {
                          navigateTo(r);
                        }

                        setRoutePicker(false);
                      }}
                    >
                      Take this route
                    </Button>
                  </Card>
                );
              })}

              <p className="pb-2 txt-xs text-muted">
                Voice: “High crowd detected ahead. A less crowded
                route is available.”
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}