import { TrainFrontIcon } from 'lucide-react';
import { PageContainer } from './PageContainer';

const links = {
  Navigate: ['Station Map', 'Find Platform', 'Coach Finder', 'Exit Finder'],
  Services: ['Live Crowd', 'Facilities', 'Medical Help', 'Accessibility'],
  Support: ['How SETU Works', 'Report a Problem', 'Emergency Contacts', 'Railway Helpline 139'],
};

export function AppFooter() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <PageContainer className="py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-amber flex items-center justify-center">
                <TrainFrontIcon className="w-5 h-5 text-navy-dark" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display font-bold text-lg">SETU</p>
                <p className="text-[10px] tracking-widest text-amber/80 font-medium">
                  STATION NAVIGATOR
                </p>
              </div>
            </div>
            <p className="txt-sm text-white/60 leading-relaxed max-w-xs">
              Smart indoor navigation for Indian railway stations. Find platforms, coaches, exits and
              facilities with confidence.
            </p>
          </div>

          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="txt-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
                {heading}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <span className="txt-sm text-white/70 hover:text-white transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="txt-xs text-white/40">
            © {new Date().getFullYear()} SETU · Smart Station Navigator · Prototype
          </p>
          <p className="txt-xs text-white/40">Dadar Railway Station · WR & CR</p>
        </div>
      </PageContainer>
    </footer>
  );
}
