import React from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import type { CrowdLevel } from '../types/setu';

export function crowdColor(level: CrowdLevel): {text: string;bg: string;dot: string;} {
  switch (level) {
    case 'Low':
      return { text: 'text-[#15803d]', bg: 'bg-[#E7F6EE]', dot: 'bg-setu-green' };
    case 'Moderate':
      return { text: 'text-[#8a5b00]', bg: 'bg-[#FDF3DC]', dot: 'bg-amber' };
    case 'High':
      return { text: 'text-[#a13a3a]', bg: 'bg-[#FBE9E9]', dot: 'bg-setu-red' };
    default:
      return { text: 'text-white', bg: 'bg-setu-red', dot: 'bg-white' };
  }
}

export function CrowdTag({ level }: {level: CrowdLevel;}) {
  const c = crowdColor(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 txt-xs font-medium ${c.bg} ${c.text}`}>
      
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {level} crowd
    </span>);

}

export function SectionLabel({ children }: {children: React.ReactNode;}) {
  return (
    <h2 className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2">
      {children}
    </h2>);

}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  full?: boolean;
}

export function Button({
  variant = 'primary',
  full,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
  'tap inline-flex items-center justify-center gap-2 rounded-lg px-4 txt-sm font-semibold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal disabled:opacity-40 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-navy text-white hover:bg-navy-dark',
    secondary: 'bg-white text-navy border border-slate-300 hover:bg-slate-50',
    ghost: 'text-navy hover:bg-slate-100',
    danger: 'bg-setu-red text-white hover:bg-[#b93a3a]'
  };
  return (
    <button
      {...rest}
      className={`${base} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}>
      
      {children}
    </button>);

}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  tone = 'light'






}: {title: string;subtitle?: string;onBack?: () => void;right?: React.ReactNode;tone?: 'light' | 'navy' | 'red';}) {
  const tones = {
    light: 'bg-white text-navy border-b hairline',
    navy: 'bg-navy text-white',
    red: 'bg-setu-red text-white'
  };
  return (
    <header className={`${tones[tone]} px-4 pt-3 pb-3 flex items-start gap-3`}>
      {onBack &&
      <button
        onClick={onBack}
        aria-label="Back"
        className={`-ml-2 tap w-10 flex items-center justify-center rounded-lg ${
        tone === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`
        }>
        
          <ChevronLeftIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      }
      <div className="flex-1 min-w-0 py-1">
        <h1 className="font-display font-semibold txt-lg leading-tight">{title}</h1>
        {subtitle &&
        <p className={`txt-sm ${tone === 'light' ? 'text-muted' : 'text-white/75'}`}>
            {subtitle}
          </p>
        }
      </div>
      {right}
    </header>);

}

export function Card({
  children,
  className = '',
  as = 'div'




}: {children: React.ReactNode;className?: string;as?: 'div' | 'section';}) {
  const Cmp = as;
  return (
    <Cmp className={`bg-white border hairline rounded-xl ${className}`}>{children}</Cmp>);

}

export function Mono({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return <span className={`font-mono tabular-nums ${className}`}>{children}</span>;
}

export function Divider() {
  return <div className="border-t hairline" />;
}