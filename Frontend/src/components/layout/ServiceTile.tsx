import React from "react";

type Accent = "navy" | "teal" | "amber" | "red";

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
  accent?: Accent;
}

const accents: Record<Accent, string> = {
  navy: "bg-navy/5 text-navy group-hover:bg-navy/10",
  teal: "bg-teal/8 text-teal group-hover:bg-teal/12",
  amber: "bg-amber-50 text-amber-700 group-hover:bg-amber-100",
  red: "bg-red-50 text-setu-red group-hover:bg-red-100",
};

const tileBase =
  "group w-full rounded-2xl border border-slate-200 bg-white text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] active:scale-[0.99]";

export function ServiceTile({
  icon,
  title,
  subtitle,
  onClick,
  accent = "navy",
}: ServiceTileProps) {
  return (
    <button type="button" onClick={onClick} className={`${tileBase} p-4`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${accents[accent]}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-navy">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-xs leading-relaxed text-muted">{subtitle}</p>
          )}
        </div>
        <span
          className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-navy"
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </button>
  );
}

export function QuickLinkTile({
  icon,
  label,
  sublabel,
  onClick,
  accent = "navy",
}: QuickLinkTileProps) {
  return (
    <button type="button" onClick={onClick} className={`${tileBase} p-3.5`}>
      <div className="flex flex-col gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${accents[accent]}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-navy">{label}</p>
          {sublabel && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{sublabel}</p>
          )}
        </div>
      </div>
    </button>
  );
}
