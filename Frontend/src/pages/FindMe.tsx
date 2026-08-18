import React from 'react';
import { NavigationIcon } from 'lucide-react';
import { useSetu } from '../contexts/SetuContext';
import {
  Button,
  Card,
  CrowdTag,
  EmptyState,
  Mono,
  ScreenHeader,
  SearchInput,
  SectionLabel,
} from '../components/ui';
import { FacilityIcon } from '../components/FacilityIcon';
import { categories, facilities, facilityTarget } from '../data/station';

export function FindMe({ title = 'Find Me' }: { title?: string }) {
  const { a11y, closeOverlay, navigateTo } = useSetu();
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);

  const results = facilities.filter((f) => {
    const matchesCat = !category || f.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q || f.name.toLowerCase().includes(q) || f.zone.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const catLabel = categories.find((c) => c.id === category)?.label;

  return (
    <div className="flex-1 flex flex-col bg-canvas min-h-0">
      <ScreenHeader
        title={title}
        subtitle="Dadar Railway Station · Middle Concourse"
        onBack={closeOverlay}
      />

      <div className="px-4 pt-3 pb-2 bg-white border-b hairline shrink-0">
        <label className="sr-only" htmlFor="findme-search">
          What are you looking for?
        </label>
        <SearchInput
          id="findme-search"
          value={query}
          onChange={setQuery}
          placeholder="What are you looking for?"
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
        <div className="px-4 py-3">
          <SectionLabel>Categories</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((c) => {
              const on = category === c.id;
              return (
                <button
                  key={c.id}
                  aria-pressed={on}
                  onClick={() => setCategory(on ? null : c.id)}
                  className={`rounded-xl border px-2 py-3 flex flex-col items-center gap-1.5 text-center transition-all duration-150 ${
                    on
                      ? 'bg-navy text-white border-navy shadow-soft'
                      : 'bg-white text-navy hairline hover:border-navy/40 hover:shadow-soft'
                  }`}
                >
                  <FacilityIcon name={c.icon} className="w-5 h-5" />
                  <span className="txt-xs font-medium leading-tight">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-6">
          <SectionLabel>{category ? `Nearest ${catLabel}` : 'Nearest to you'}</SectionLabel>

          {results.length === 0 ? (
            <EmptyState
              title="Nothing found"
              description="Try another category, or ask at the Information Desk on the middle concourse."
            />
          ) : (
            <ul className="space-y-2.5">
              {results
                .slice()
                .sort((a, b) => a.distanceM - b.distanceM)
                .map((f, i) => (
                  <li key={f.id}>
                    <Card
                      className={`p-3.5 ${i === 0 ? 'border-2 border-navy' : ''}`}
                      hover
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="w-10 h-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <FacilityIcon name={f.icon} className="w-[18px] h-[18px]" />
                        </span>
                        <div className="flex-1 min-w-0">
                          {i === 0 && (
                            <p className="txt-xs font-semibold uppercase tracking-wider text-teal mb-0.5">
                              Nearest
                            </p>
                          )}
                          <p className="font-display font-semibold txt-base text-navy">{f.name}</p>
                          <p className="txt-sm text-muted">{f.zone}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="txt-sm text-navy">
                              <Mono className="font-semibold">{f.distanceM}</Mono> m ·{' '}
                              <Mono>{f.walkMin}</Mono> min walk
                            </span>
                            <span
                              className={`txt-xs font-medium ${
                                f.accessible ? 'text-teal' : 'text-muted'
                              }`}
                            >
                              {f.accessible ? 'Step-free' : 'Stairs on route'}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="txt-xs font-medium text-setu-green">{f.status}</span>
                            {f.crowd && <CrowdTag level={f.crowd} />}
                          </div>
                        </div>
                      </div>
                      <Button
                        full
                        className="mt-3"
                        variant={i === 0 ? 'primary' : 'secondary'}
                        onClick={() => navigateTo(facilityTarget(f, a11y))}
                      >
                        <NavigationIcon className="w-4 h-4" strokeWidth={2} />
                        Navigate
                      </Button>
                    </Card>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
