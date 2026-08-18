import React from 'react';
import {
  ChevronLeftIcon,
  Loader2Icon,
  SearchIcon,
  InboxIcon,
  AlertCircleIcon,
} from 'lucide-react';
import type { CrowdLevel } from '../types/setu';

/* -------------------------------------------------------------------------- */
/* Crowd utilities                                                            */
/* -------------------------------------------------------------------------- */

export function crowdColor(level: CrowdLevel): { text: string; bg: string; dot: string } {
  switch (level) {
    case 'Low':
      return { text: 'text-[#15803d]', bg: 'bg-[#E7F6EE]', dot: 'bg-setu-green' };
    case 'Moderate':
      return { text: 'text-[#8a5b00]', bg: 'bg-amber-100', dot: 'bg-amber' };
    case 'High':
      return { text: 'text-[#a13a3a]', bg: 'bg-[#FBE9E9]', dot: 'bg-setu-red' };
    default:
      return { text: 'text-white', bg: 'bg-setu-red', dot: 'bg-white' };
  }
}

export function CrowdTag({ level }: { level: CrowdLevel }) {
  const c = crowdColor(level);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 txt-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {level} crowd
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="txt-xs font-semibold tracking-[0.12em] uppercase text-muted mb-2.5">
      {children}
    </h2>
  );
}

export function Mono({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`font-mono tabular-nums ${className}`}>{children}</span>;
}

export function Divider() {
  return <div className="border-t hairline" />;
}

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'tap inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 txt-xs',
    md: 'px-4 py-2.5 txt-sm',
    lg: 'px-5 py-3 txt-base',
  };

  const variants: Record<string, string> = {
    primary: 'bg-navy text-white hover:bg-navy-800 shadow-soft hover:shadow-card',
    secondary:
      'bg-white text-navy border border-border hover:bg-slate-50 hover:border-slate-300 shadow-soft',
    ghost: 'text-navy hover:bg-slate-100',
    danger: 'bg-setu-red text-white hover:bg-[#b93a3a] shadow-soft',
    teal: 'bg-teal text-white hover:bg-teal-600 shadow-soft',
  };

  return (
    <button
      {...rest}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = '',
  as = 'div',
  hover = false,
  padding = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
  hover?: boolean;
  padding?: boolean;
}) {
  const Cmp = as;
  return (
    <Cmp
      className={`bg-white border hairline rounded-2xl shadow-card ${
        hover ? 'transition-shadow duration-150 hover:shadow-elevated' : ''
      } ${padding ? 'p-4' : ''} ${className}`}
    >
      {children}
    </Cmp>
  );
}

/* -------------------------------------------------------------------------- */
/* Input                                                                      */
/* -------------------------------------------------------------------------- */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, className = '', ...rest }: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 text-muted pointer-events-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        {...rest}
        className={`w-full h-11 rounded-xl border border-border bg-white txt-sm text-navy placeholder:text-muted outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 disabled:bg-slate-50 disabled:cursor-not-allowed ${
          icon ? 'pl-10 pr-3' : 'px-3'
        } ${className}`}
      />
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  id,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}) {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      icon={<SearchIcon className="w-4 h-4" strokeWidth={2} />}
      className={className}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Screen header                                                              */
/* -------------------------------------------------------------------------- */

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  tone = 'light',
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  tone?: 'light' | 'navy' | 'red';
}) {
  const tones = {
    light: 'bg-white text-navy border-b hairline shadow-soft',
    navy: 'bg-navy text-white',
    red: 'bg-setu-red text-white',
  };

  return (
    <header className={`${tones[tone]} px-4 pt-3 pb-3 flex items-start gap-3 shrink-0`}>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className={`-ml-1 tap w-10 flex items-center justify-center rounded-xl transition-colors duration-150 ${
            tone === 'light' ? 'hover:bg-slate-100 text-navy' : 'hover:bg-white/10 text-white'
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5" strokeWidth={2.2} />
        </button>
      )}
      <div className="flex-1 min-w-0 py-0.5">
        <h1 className="font-display font-semibold txt-lg leading-tight">{title}</h1>
        {subtitle && (
          <p className={`txt-sm mt-0.5 ${tone === 'light' ? 'text-muted' : 'text-white/75'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'teal';
  className?: string;
}) {
  const variants = {
    default: 'bg-slate-100 text-navy',
    success: 'bg-[#E7F6EE] text-[#15803d]',
    warning: 'bg-amber-100 text-[#8a5b00]',
    danger: 'bg-[#FBE9E9] text-[#a13a3a]',
    teal: 'bg-teal-50 text-teal-600',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 txt-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Alert banner                                                               */
/* -------------------------------------------------------------------------- */

export function AlertBanner({
  children,
  variant = 'warning',
  icon,
  onClick,
  action,
}: {
  children: React.ReactNode;
  variant?: 'warning' | 'danger' | 'info' | 'success';
  icon?: React.ReactNode;
  onClick?: () => void;
  action?: React.ReactNode;
}) {
  const variants = {
    warning: 'bg-amber-100 border-amber-500/30 text-navy',
    danger: 'bg-[#FBE9E9] border-setu-red/30 text-navy',
    info: 'bg-teal-50 border-teal/20 text-navy',
    success: 'bg-[#E7F6EE] border-setu-green/30 text-navy',
  };

  const Cmp = onClick ? 'button' : 'div';

  return (
    <Cmp
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-l-4 p-3.5 flex items-start gap-3 transition-colors duration-150 ${
        variants[variant]
      } ${onClick ? 'hover:brightness-[0.98] cursor-pointer' : ''}`}
    >
      {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      <span className="flex-1 min-w-0 txt-sm">{children}</span>
      {action && <span className="shrink-0">{action}</span>}
    </Cmp>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-muted mb-4">
        {icon ?? <InboxIcon className="w-6 h-6" strokeWidth={1.8} />}
      </div>
      <p className="font-display font-semibold txt-base text-navy">{title}</p>
      {description && <p className="txt-sm text-muted mt-1.5 max-w-[28ch]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading states                                                             */
/* -------------------------------------------------------------------------- */

export function LoadingSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
  return (
    <Loader2Icon
      className={`animate-spin text-teal ${sizes[size]} ${className}`}
      strokeWidth={2}
      aria-label="Loading"
    />
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-1" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-muted/60 animate-typing-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fade-in">
      <LoadingSpinner size="lg" />
      <p className="txt-sm text-muted">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error state                                                                */
/* -------------------------------------------------------------------------- */

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[#FBE9E9] flex items-center justify-center text-setu-red mb-4">
        <AlertCircleIcon className="w-6 h-6" strokeWidth={1.8} />
      </div>
      <p className="font-display font-semibold txt-base text-navy">{title}</p>
      {description && <p className="txt-sm text-muted mt-1.5 max-w-[28ch]">{description}</p>}
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat tile                                                                  */
/* -------------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50/80 px-3 py-2.5">
      <p className="txt-xs text-muted uppercase tracking-wider font-medium">{label}</p>
      <div className="mt-0.5 font-mono font-semibold txt-xl text-navy tabular-nums">{value}</div>
      {sub && <p className="txt-xs text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category pill                                                              */
/* -------------------------------------------------------------------------- */

export function CategoryPill({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 txt-sm font-semibold border transition-all duration-150 ${
        active
          ? 'bg-navy text-white border-navy shadow-soft'
          : 'bg-white text-navy border-border hover:border-navy/40 hover:bg-slate-50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick action card                                                          */
/* -------------------------------------------------------------------------- */

export function QuickActionCard({
  label,
  description,
  icon,
  onClick,
  variant = 'default',
}: {
  label: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'wide';
}) {
  const variants = {
    default:
      'bg-white border hairline hover:border-navy/30 hover:shadow-card active:scale-[0.98]',
    danger: 'bg-[#FBE9E9] border border-[#f0cccc] hover:brightness-[0.98]',
    wide: 'bg-white border hairline hover:border-navy/30 hover:shadow-card col-span-2',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap rounded-2xl px-3.5 py-3.5 flex items-center gap-3 text-left transition-all duration-150 ${variants[variant]}`}
    >
      <span
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          variant === 'danger' ? 'bg-white/60 text-setu-red' : 'bg-navy/5 text-navy'
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block txt-sm font-semibold text-navy">{label}</span>
        {description && (
          <span
            className={`block txt-xs mt-0.5 truncate ${
              variant === 'danger' ? 'text-[#a13a3a]' : 'text-muted'
            }`}
          >
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
