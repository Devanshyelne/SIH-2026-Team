import React from 'react';
import {
  AccessibilityIcon,
  BellIcon,
  FlagIcon,
  LanguagesIcon,
  LogInIcon,
  LogOutIcon,
  ShieldIcon,
  TrainFrontIcon,
  UserIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSetu } from '../contexts/SetuContext';
import { PageContainer, PageHero, PageSection } from '../components/layout/PageContainer';
import { Badge, Button, Card } from '../components/ui';

export function Profile() {
  const { a11y, setMode, reset, openOverlay } = useSetu();
  const { user, isAuthenticated, logout, showLogin, showRegister } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-canvas">
      <PageHero title="Profile" subtitle="Manage your SETU preferences" compact />

      <PageContainer className="pb-10">
        <Card className="p-5 sm:p-6 flex items-center gap-4 -mt-2 relative z-10 shadow-elevated" hover>
          <span className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center shadow-soft shrink-0 font-display font-bold text-2xl">
            {isAuthenticated && user
              ? user.username.charAt(0).toUpperCase()
              : <UserIcon className="w-8 h-8" strokeWidth={1.8} />}
          </span>
          <div className="flex-1 min-w-0">
            {isAuthenticated && user ? (
              <>
                <p className="font-display font-semibold text-xl text-navy truncate">{user.username}</p>
                <p className="txt-sm text-muted mt-0.5 truncate">{user.email}</p>
                <Badge variant="success" className="mt-2">Signed in</Badge>
              </>
            ) : (
              <>
                <p className="font-display font-semibold text-xl text-navy">Guest traveller</p>
                <p className="txt-sm text-muted mt-0.5">Sign in to save preferences</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={showLogin}>
                    <LogInIcon className="w-4 h-4" strokeWidth={2} />
                    Login
                  </Button>
                  <Button size="sm" variant="secondary" onClick={showRegister}>
                    Register
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        <PageSection title="Current Mode">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <span
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  a11y ? 'bg-teal text-white' : 'bg-slate-100 text-navy'
                }`}
              >
                {a11y ? (
                  <AccessibilityIcon className="w-6 h-6" strokeWidth={2} />
                ) : (
                  <TrainFrontIcon className="w-6 h-6" strokeWidth={2} />
                )}
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold text-navy">
                  {a11y ? 'Accessibility Mode' : 'Normal Mode'}
                </p>
                <p className="txt-sm text-muted mt-0.5">
                  {a11y
                    ? 'Larger controls, voice guidance, lift/ramp priority, higher contrast.'
                    : 'Standard text size, normal navigation and station map.'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant={a11y ? 'secondary' : 'primary'} onClick={() => setMode('normal')} aria-pressed={!a11y}>
                Normal
              </Button>
              <Button variant={a11y ? 'primary' : 'secondary'} onClick={() => setMode('accessibility')} aria-pressed={a11y}>
                Accessibility
              </Button>
            </div>
          </Card>
        </PageSection>

        <PageSection title="Preferences">
          <Card className="divide-y divide-slate-200 overflow-hidden">
            {[
              { Icon: BellIcon, label: 'Alerts', detail: 'Platform change, crowd, delays' },
              { Icon: LanguagesIcon, label: 'Language', detail: 'English · मराठी · हिन्दी' },
              { Icon: ShieldIcon, label: 'Emergency contacts', detail: '2 saved contacts' },
            ].map(({ Icon, label, detail }) => (
              <button
                key={label}
                className="tap w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-navy" strokeWidth={1.9} />
                </div>
                <span className="flex-1">
                  <span className="block txt-sm font-semibold text-navy">{label}</span>
                  <span className="block txt-sm text-muted">{detail}</span>
                </span>
              </button>
            ))}
            <button
              onClick={() => openOverlay('crowd')}
              className="tap w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                <FlagIcon className="w-4 h-4 text-navy" strokeWidth={1.9} />
              </div>
              <span className="flex-1">
                <span className="block txt-sm font-semibold text-navy">Report a problem</span>
                <span className="block txt-sm text-muted">
                  Lift out of service, blocked route, wrong signage
                </span>
              </span>
            </button>
          </Card>
        </PageSection>

        <PageSection title="Account">
          {isAuthenticated ? (
            <Button variant="danger" full onClick={logout}>
              <LogOutIcon className="w-4 h-4" strokeWidth={2} />
              Logout
            </Button>
          ) : null}
          <Button variant="secondary" full className={isAuthenticated ? 'mt-3' : ''} onClick={reset}>
            Change mode and restart SETU
          </Button>
          <p className="txt-xs text-muted text-center mt-3">
            SETU · Smart Station Navigator · Dadar Railway Station
          </p>
        </PageSection>
      </PageContainer>
    </div>
  );
}
