import type { ReactNode } from 'react';
import { icons } from './assets';

export type PageKey = 'ritual' | 'share' | 'sealed' | 'birth' | 'my';

export function goTo(page: PageKey): void {
  window.location.hash = page;
}

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <div className="status-time">9:41</div>
      <div className="status-icons">
        <div className="signal-bars"><i /><i /><i /><i /></div>
        <div className="wifi-icon"><span /></div>
        <div className="battery-icon"><span /></div>
      </div>
    </div>
  );
}

export function BackButton({ tone = 'blue' }: { tone?: 'blue' | 'gold' }) {
  return (
    <button className={`back-button back-button-${tone}`} type="button" aria-label="Back" onClick={() => history.back()}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15.5 5 8.5 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function AuraLogo({ subtitle }: { subtitle?: string }) {
  return (
    <header className="aura-logo">
      <img className="aura-logo-mark" src={icons.lotusLogo} alt="" />
      <div className="aura-logo-word">AuraCue</div>
      {subtitle ? <div className="aura-logo-subtitle">{subtitle}</div> : null}
    </header>
  );
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`screen ${className}`}>{children}</main>;
}

export function ScreenChrome({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Screen className={className}>
      <StatusBar />
      {children}
    </Screen>
  );
}

export function TopPill({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="top-pill">
      <img src={icon} alt="" />
      <span>{children}</span>
    </div>
  );
}

export function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`section-divider ${className}`} aria-hidden="true">
      <span />
      <b>✦</b>
      <span />
    </div>
  );
}

export function IconImg({ src, className = '' }: { src: string; className?: string }) {
  return <img className={`icon-img ${className}`} src={src} alt="" />;
}

export function ChoiceChip({ icon, label, selected = false, wide = false }: { icon: string; label: string; selected?: boolean; wide?: boolean }) {
  return (
    <button className={`choice-chip ${selected ? 'is-selected' : ''} ${wide ? 'is-wide' : ''}`} type="button">
      <img src={icon} alt="" />
      <span>{label}</span>
      {selected ? <img className="check-badge" src={icons.checkBadge} alt="" /> : null}
    </button>
  );
}

export function GradientButton({ children, icon, onClick }: { children: ReactNode; icon?: ReactNode; onClick?: () => void }) {
  return (
    <button className="gradient-button" type="button" onClick={onClick}>
      <span className="button-star">✦</span>
      {icon ? <span className="button-icon">{icon}</span> : null}
      <span>{children}</span>
      <span className="button-star">✦</span>
    </button>
  );
}

export function OutlineButton({ children, icon, onClick }: { children: ReactNode; icon?: ReactNode; onClick?: () => void }) {
  return (
    <button className="outline-button" type="button" onClick={onClick}>
      {icon ? <span className="outline-icon">{icon}</span> : null}
      <span>{children}</span>
      <span className="outline-star">✦</span>
    </button>
  );
}

export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={`chevron ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V4m0 0 4.5 4.5M12 4 7.5 8.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10.5v7.2c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-7.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17.5v1.8h14v-1.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.5 13.5 13.5 10.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M9.8 7.2 11 6a4 4 0 0 1 5.7 5.7l-1.2 1.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M14.2 16.8 13 18a4 4 0 0 1-5.7-5.7l1.2-1.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4.5h10v15l-5-3-5 3v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 16.8-.7 3 3-.7L18.8 7.6l-2.3-2.3L5 16.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15.8 6 2.2 2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M19.4 13.3v-2.6l-2.1-.5a6 6 0 0 0-.6-1.4l1.1-1.8-1.8-1.8-1.8 1.1a6 6 0 0 0-1.4-.6L12.3 3h-2.6l-.5 2.1a6 6 0 0 0-1.4.6L6 4.6 4.2 6.4l1.1 1.8a6 6 0 0 0-.6 1.4L2.6 10v2.6l2.1.5c.1.5.3 1 .6 1.4l-1.1 1.8L6 18.2l1.8-1.1c.4.3.9.5 1.4.6l.5 2.1h2.6l.5-2.1c.5-.1 1-.3 1.4-.6l1.8 1.1 1.8-1.8-1.1-1.8c.3-.4.5-.9.6-1.4l2.1-.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function JacketIllustration() {
  return (
    <svg className="jacket-svg" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#eee5ff" />
      <path d="M28 18 18 29v39h16V39l6 10 6-10v29h16V29L52 18l-7 5H35l-7-5Z" fill="#0d1f54" />
      <path d="M35 23 28 18M45 23l7-5M34 39l6 10 6-10" stroke="#d6a45e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 34h11M44 34h11M26 52h10M44 52h10" stroke="#f0c778" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="40" cy="30" r="1.8" fill="#f5d28f" />
      <circle cx="40" cy="38" r="1.8" fill="#f5d28f" />
    </svg>
  );
}

export function ColorSwatch({ className = '' }: { className?: string }) {
  return <span className={`color-swatch ${className}`} />;
}

export function BottomNav({ active }: { active: 'home' | 'my' }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button className={active === 'home' ? 'active' : ''} type="button" onClick={() => goTo('ritual')}>
        <img src={active === 'home' ? icons.homePurple : icons.homeGold} alt="" />
        <span>Home</span>
      </button>
      <i aria-hidden="true" />
      <button className={active === 'my' ? 'active' : ''} type="button" onClick={() => goTo('my')}>
        <img src={icons.userGray} alt="" />
        <span>My</span>
      </button>
    </nav>
  );
}
