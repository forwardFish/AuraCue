import React from 'react';
import { icons } from './assets';

export type IconButtonVariant = 'round' | 'square' | 'gift' | 'close';

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span className="status-time">9:41</span>
      <span className="status-icons">
        <span className="cellular"><i/><i/><i/><i/></span>
        <span className="wifi"><i/><i/><i/></span>
        <span className="battery"><i/></span>
      </span>
    </div>
  );
}

export function BrandHeader({ subtitle = false, compact = false }: { subtitle?: boolean; compact?: boolean }) {
  return (
    <header className={`brand-header ${compact ? 'brand-header--compact' : ''}`}>
      <img className="brand-lotus" src={icons.lotusLogo} alt="AuraCue lotus" />
      <div className="brand-name">AuraCue</div>
      {subtitle && <p className="brand-subtitle">Your Daily Tarot Style Oracle</p>}
    </header>
  );
}

export function TopIconButton({ type = 'back', side = 'left', variant = 'round' }: {
  type?: 'back' | 'gift' | 'sparkle' | 'close';
  side?: 'left' | 'right';
  variant?: IconButtonVariant;
}) {
  const src = type === 'gift' ? icons.gift : type === 'sparkle' ? icons.sparkleGold : type === 'close' ? icons.closeCircleBlue : icons.backCircleBlue;
  return (
    <button className={`top-button top-button--${side} top-button--${variant}`} aria-label={type}>
      <img src={src} alt="" />
    </button>
  );
}

export function Screen({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <main className={`app-screen ${className}`}>{children}</main>;
}

export function GradientButton({ children, className = '', icon }: { children: React.ReactNode; className?: string; icon?: string }) {
  return (
    <button className={`gradient-button ${className}`}>
      <span className="button-star">✦</span>
      {icon && <img src={icon} alt="" />}
      <span>{children}</span>
      <span className="button-star">✦</span>
    </button>
  );
}

export function OutlineButton({ children, icon, className = '' }: { children: React.ReactNode; icon?: string; className?: string }) {
  return (
    <button className={`outline-button ${className}`}>
      {icon && <img src={icon} alt="" />}
      <span>{children}</span>
    </button>
  );
}

export function DecorativeDivider({ className = '' }: { className?: string }) {
  return <div className={`decorative-divider ${className}`}><span/><i>✦</i><span/></div>;
}

export function InfoChip({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div className="info-chip">
      {icon && <img src={icon} alt="" />}
      <span>{children}</span>
    </div>
  );
}

export function BottomNav({ active = 'home' }: { active?: 'home' | 'my' }) {
  return (
    <nav className="bottom-nav">
      <a className={`nav-tab ${active === 'home' ? 'nav-tab--active' : ''}`} href="#/draw">
        <img src={active === 'home' ? icons.homePurple : icons.homeGold} alt="" />
        <span>Home</span>
      </a>
      <span className="nav-divider" />
      <a className={`nav-tab ${active === 'my' ? 'nav-tab--active' : ''}`} href="#/my">
        <img src={active === 'my' ? icons.userBlueGray : icons.userGray} alt="" />
        <span>My</span>
      </a>
    </nav>
  );
}

export function HomeIndicator() {
  return <div className="home-indicator" aria-hidden="true" />;
}

export function AppChrome({ children, className = '', nav = false, navActive = 'home' as 'home' | 'my' }: {
  children: React.ReactNode;
  className?: string;
  nav?: boolean;
  navActive?: 'home' | 'my';
}) {
  return (
    <Screen className={className}>
      <StatusBar />
      {children}
      {nav && <BottomNav active={navActive} />}
      <HomeIndicator />
    </Screen>
  );
}
