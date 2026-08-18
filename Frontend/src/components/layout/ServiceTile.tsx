import React from "react";

type Accent =
  | "navy"
  | "teal"
  | "amber"
  | "red";

interface ServiceTileProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  accent?: Accent;
}

interface QuickLinkTileProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
}

const accents: Record<Accent, string> = {
  navy: "bg-[#12385B]/5 text-[#12385B]",
  teal: "bg-[#0F766E]/8 text-[#0F766E]",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-rose-50 text-rose-600",
};

/* ============================================================
   SERVICE TILE
   ============================================================ */

export function ServiceTile({
  icon,
  title,
  subtitle,
  onClick,
  accent = "navy",
}: ServiceTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        text-left
        shadow-[0_3px_15px_rgba(15,23,42,0.04)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
        active:scale-[0.99]
      "
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${accents[accent]}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-[#12385B]">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <span
          className="
            text-slate-300
            transition-transform
            group-hover:translate-x-0.5
            group-hover:text-[#12385B]
          "
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </button>
  );
}

/* ============================================================
   QUICK LINK TILE
   Used by Home.tsx
   ============================================================ */

export function QuickLinkTile({
  icon,
  label,
  sublabel,
  onClick,
}: QuickLinkTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        min-w-[150px]
        shrink-0
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3.5
        text-left
        shadow-[0_3px_15px_rgba(15,23,42,0.04)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
        active:scale-[0.99]
      "
    >
      <div className="flex items-start gap-3">
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
            transition-colors
            group-hover:bg-[#12385B]/10
          "
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-[#12385B]">
            {label}
          </p>

          {sublabel && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {sublabel}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}