import React from 'react';
import { ChevronRightIcon } from 'lucide-react';

export function ServiceTile({
  label,
  description,
  icon,
  onClick,
  accent = 'navy',
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  accent?: 'navy' | 'teal' | 'amber' | 'red' | 'green';
}) {
  const accents = {
    navy: 'bg-navy/5 text-navy group-hover:bg-navy/10',
    teal: 'bg-teal-50 text-teal group-hover:bg-teal-100',
    amber: 'bg-amber-100 text-[#8a5b00] group-hover:bg-amber-200/60',
    red: 'bg-[#FBE9E9] text-setu-red group-hover:bg-red-100',
    green: 'bg-[#E7F6EE] text-setu-green group-hover:bg-green-100',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group tap w-full text-left bg-white border hairline rounded-2xl p-4 shadow-card hover:shadow-elevated hover:border-navy/20 transition-all duration-200"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors duration-150 ${accents[accent]}`}
      >
        {icon}
      </div>
      <p className="font-display font-semibold txt-sm text-navy">{label}</p>
      <p className="txt-xs text-muted mt-0.5 leading-relaxed">{description}</p>
      <span className="inline-flex items-center gap-0.5 txt-xs font-semibold text-teal mt-2.5 group-hover:gap-1 transition-all duration-150">
        Open <ChevronRightIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
      </span>
    </button>
  );
}

export function QuickLinkTile({
  label,
  sublabel,
  icon,
  onClick,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group tap flex flex-col items-center text-center bg-white border hairline rounded-2xl p-4 shadow-card hover:shadow-elevated hover:border-teal/30 transition-all duration-200 min-w-[120px] flex-1"
    >
      <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center mb-2.5 group-hover:bg-teal-50 group-hover:text-teal transition-colors duration-150">
        {icon}
      </div>
      <p className="txt-sm font-semibold text-navy">{label}</p>
      <p className="txt-xs text-muted mt-0.5">{sublabel}</p>
    </button>
  );
}
