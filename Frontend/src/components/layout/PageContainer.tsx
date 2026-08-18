import React from 'react';

export function PageContainer({
  children,
  className = '',
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${wide ? 'max-w-7xl' : 'max-w-6xl'} px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageSection({
  title,
  subtitle,
  action,
  children,
  className = '',
  id,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-6 sm:py-8 ${className}`}>
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
        <div>
          <h2 className="font-display font-semibold text-lg sm:text-xl text-navy tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="txt-sm text-muted mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PageHero({
  title,
  subtitle,
  children,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`gradient-mesh text-white ${compact ? 'py-6 sm:py-8' : 'py-8 sm:py-12'}`}>
      <PageContainer>
        <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight max-w-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="txt-base sm:txt-lg text-white/70 mt-2 max-w-xl leading-relaxed">{subtitle}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </PageContainer>
    </div>
  );
}
