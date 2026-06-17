import React from 'react';
import { AppChrome, BrandHeader, DecorativeDivider, GradientButton, InfoChip, OutlineButton, TopIconButton } from './components';
import { art, icons, intentIcons, moodIcons } from './assets';

type CardPick = { id: string; label: string; icon?: string; selected?: boolean; wide?: boolean };

function ChoicePill({ item }: { item: CardPick }) {
  return (
    <button className={`choice-pill ${item.selected ? 'choice-pill--selected' : ''} ${item.wide ? 'choice-pill--wide' : ''}`}>
      {item.icon && <img src={item.icon} alt="" />}
      <span>{item.label}</span>
      {item.selected && <img className="choice-check" src={icons.selectedCheck} alt="selected" />}
    </button>
  );
}

export function CardDrawPage() {
  return (
    <AppChrome className="screen-draw" nav>
      <TopIconButton type="sparkle" side="left" />
      <TopIconButton type="gift" side="right" variant="gift" />
      <BrandHeader subtitle />
      <DecorativeDivider />
      <section className="draw-hero">
        <h1>Choose the card<br />that calls you.</h1>
        <p>Take one breath. Let today’s aura find you.</p>
      </section>
      <section className="card-stage" aria-label="Choose a tarot card">
        <div className="tarot-card tarot-card--left"><img src={art.tarotCardBack} alt="Card I" /><b>Card I</b></div>
        <div className="tarot-card tarot-card--center"><img src={art.tarotCardBack} alt="Card II" /><b>Card II</b></div>
        <div className="tarot-card tarot-card--right"><img src={art.tarotCardBack} alt="Card III" /><b>Card III</b></div>
      </section>
      <div className="tap-copy"><span>☝</span>Tap one card to draw today’s aura.</div>
      <InfoChip icon={icons.sparkleGold}>30-second ritual&nbsp;&nbsp;•&nbsp;&nbsp;private&nbsp;&nbsp;•&nbsp;&nbsp;just for you</InfoChip>
      <GradientButton className="draw-cta">Reveal My Aura</GradientButton>
    </AppChrome>
  );
}

export function BirthdayPage() {
  return (
    <AppChrome className="screen-birthday">
      <TopIconButton side="left" variant="square" />
      <BrandHeader compact />
      <section className="title-block title-block--birthday">
        <span className="side-sparkle">✦</span>
        <h1>Enter Your Birthday</h1>
        <span className="side-sparkle side-sparkle--right">✦</span>
        <p>Your birthday becomes the key to<br />how each card speaks to you.</p>
      </section>
      <section className="birthday-picker-card">
        <div className="picker-grid">
          <div className="picker-column">
            <b>Month</b>
            <span>August</span>
            <span>September</span>
            <strong>October</strong>
            <span>November</span>
            <span>December</span>
          </div>
          <div className="picker-column picker-column--day">
            <b>Day</b>
            <span>5</span>
            <span>6</span>
            <strong>7</strong>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <p className="need-copy"><span>✦</span>We only need your month and day.</p>
        <div className="privacy-copy">
          <img src={icons.privacyLock} alt="" />
          <p>Your birthday is private and never shared.<br />It’s used only to personalize your readings.</p>
        </div>
      </section>
      <GradientButton className="birthday-cta">Continue</GradientButton>
    </AppChrome>
  );
}

export function HoldToSealPage() {
  return (
    <AppChrome className="screen-hold">
      <TopIconButton side="left" />
      <BrandHeader compact />
      <section className="title-block hold-title">
        <h1>Hold to Seal</h1>
        <p>Press and carry today’s aura with you.</p>
      </section>
      <section className="seal-orb">
        <img className="seal-orb__bg" src={art.sealOrbPink} alt="" />
        <img className="seal-orb__lotus" src={art.lotusPink} alt="" />
        <h2>Soft Boundary</h2>
        <DecorativeDivider />
        <p>I protect my peace<br />with grace.</p>
      </section>
      <button className="hold-button">
        <span className="hold-button__knob"><img src={icons.sparkleLilacOutline} alt="" /></span>
        <span>Hold to Seal</span>
      </button>
      <div className="timer-copy">◷&nbsp; 2 seconds to activate</div>
    </AppChrome>
  );
}

export function RitualResultPage() {
  const styleRows = [
    { img: art.softOpalSwatch, label: 'Lucky Color', value: 'Charcoal Navy' },
    { img: icons.dress, label: 'Guardian Item', value: 'Structured Jacket' },
    { img: icons.flowerPink ?? art.birthAuraVenusAir, label: 'Style Formula', value: 'Soft layer + clean outer shape + silver detail' },
  ];

  return (
    <AppChrome className="screen-result">
      <TopIconButton side="left" variant="square" />
      <TopIconButton type="gift" side="right" />
      <BrandHeader subtitle compact />
      <InfoChip icon={icons.calendarStar}>Jun 13 • Saturday</InfoChip>
      <section className="planet-card">
        <div>
          <p>Today’s Ruling Planet <span>✧</span></p>
          <h1>Saturn</h1>
          <div className="planet-tags">
            <span><img src={icons.shield} alt=""/>Structure</span>
            <span><img src={icons.lock} alt=""/>Boundaries</span>
            <span><img src={icons.scales} alt=""/>Stability</span>
          </div>
          <div className="mini-tags">
            <span><img src={icons.venus} alt=""/>Birth Aura<br /><b>Venus Air</b></span>
            <span><img src={icons.shield} alt=""/>Card<br /><b>Strength</b></span>
          </div>
        </div>
        <div className="saturn-portal"><span className="portal-moon">☾</span><span className="portal-planet">♄</span></div>
      </section>
      <section className="aura-card-summary">
        <div>
          <p>Today’s Aura</p>
          <h2>Strength</h2>
          <h3>Soft Boundary</h3>
          <div className="state-shift"><span><img src={moodIcons.drained} alt=""/>Drained</span><b>→</b><span><img src={icons.shield} alt=""/>Protected</span></div>
        </div>
        <img src={icons.shield} alt="Strength shield" />
      </section>
      <section className="why-card">
        <h3><span>✧</span> Why this card found you today</h3>
        <p>You arrived feeling drained.<br />Your Birth Aura, Venus Air, may be giving too much.<br />Strength asks you to choose soft boundaries<br />that protect your energy and honor your worth.</p>
      </section>
      <h2 className="style-cue-title"><span>✦</span>Today’s Style Cue<span>✦</span></h2>
      <section className="style-list">
        {styleRows.map((row) => (
          <button className="style-row" key={row.label}>
            <img className="style-row__icon" src={row.img} alt="" />
            <span><small>{row.label}</small><b>{row.value}</b></span>
            <i>›</i>
          </button>
        ))}
      </section>
      <GradientButton className="result-cta">Seal Today’s Aura</GradientButton>
      <div className="result-actions"><OutlineButton icon={icons.dividerPurple}>Save Card</OutlineButton><OutlineButton icon={icons.sparklePurple}>Share Story</OutlineButton></div>
    </AppChrome>
  );
}

export function ReadingAuraPage() {
  return (
    <AppChrome className="screen-reading">
      <TopIconButton side="left" variant="square" />
      <BrandHeader compact />
      <section className="title-block reading-title">
        <h1>Reading your aura...</h1>
        <p>Birth Aura • Today’s Ruling Planet • Chosen Card</p>
      </section>
      <section className="reading-orbit">
        <img src={art.tarotCardBack} alt="Card II" />
      </section>
      <div className="gather-copy">Gathering your style oracle</div>
      <div className="loading-bar"><span /></div>
    </AppChrome>
  );
}

export function ErrorRetryPage() {
  return (
    <AppChrome className="screen-error">
      <TopIconButton type="close" side="left" />
      <BrandHeader compact />
      <section className="error-card-art">
        <img src={art.tarotCardTilt} alt="floating aura card" />
      </section>
      <section className="error-copy">
        <h1>Your aura slipped<br />away for a second.<span>✧</span></h1>
        <DecorativeDivider />
        <p>Let’s reconnect and try again.</p>
      </section>
      <GradientButton className="error-cta">Try Again</GradientButton>
      <OutlineButton className="change-scene" icon={icons.lotusLogo}>Change Scene</OutlineButton>
    </AppChrome>
  );
}

export function PreparingOraclePage() {
  const steps = [
    { icon: art.prepCrystal, label: 'Reading your Birth Aura...', pct: 74 },
    { icon: art.prepPlanet, label: 'Aligning with today’s ruling planet...', pct: 58 },
    { icon: art.prepMoon, label: 'Listening to your card...', pct: 46 },
    { icon: art.prepStar, label: 'Translating energy into style...', pct: 38 },
  ];
  return (
    <AppChrome className="screen-preparing">
      <TopIconButton side="left" variant="square" />
      <BrandHeader compact />
      <section className="strength-hero">
        <img src={art.strengthWomanLion} alt="Strength Soft Boundary" />
      </section>
      <h2 className="preparing-title"><span />Preparing Your Oracle<span /></h2>
      <section className="prep-steps">
        {steps.map((step) => (
          <div className="prep-step" key={step.label}>
            <img src={step.icon} alt="" />
            <div>
              <b>{step.label}</b>
              <i><span style={{ width: `${step.pct}%` }} /></i>
            </div>
            <em>✧</em>
          </div>
        ))}
      </section>
      <div className="almost-ready"><span>✧</span>Your oracle is almost ready...<span>✧</span></div>
    </AppChrome>
  );
}

export function BirthAuraResultPage() {
  return (
    <AppChrome className="screen-birth-result">
      <TopIconButton side="left" variant="square" />
      <BrandHeader compact />
      <DecorativeDivider />
      <section className="birth-result-title">
        <span>Your Birth Aura is</span>
        <h1>Venus Air</h1>
      </section>
      <div className="birth-tags">
        <span><img src={art.libraBadge} alt="" />Libra</span>
        <span className="wind-icon">≋ Air</span>
        <span><img src={art.softOpalSwatch} alt="" />Opal</span>
      </div>
      <section className="quote-card">
        <p>You carry luck through<br />balance, beauty, and<br />subtle attraction.</p>
      </section>
      <section className="guardian-color-card">
        <img src={art.birthAuraVenusAir} alt="Venus Air birth aura" />
        <div>
          <small>Your First Guardian Color</small>
          <h2>Soft Opal Pink</h2>
          <p>Harmony, charm, and<br />gentle magnetism.</p>
        </div>
      </section>
      <GradientButton className="begin-ritual">Begin Today’s Ritual</GradientButton>
      <p className="edit-note">You can edit this later in My Aura.</p>
    </AppChrome>
  );
}

export const pages = [
  { path: 'draw', title: 'Card Draw', component: CardDrawPage },
  { path: 'birthday', title: 'Birthday', component: BirthdayPage },
  { path: 'hold', title: 'Hold to Seal', component: HoldToSealPage },
  { path: 'result', title: 'Today Result', component: RitualResultPage },
  { path: 'reading', title: 'Reading Aura', component: ReadingAuraPage },
  { path: 'error', title: 'Error Retry', component: ErrorRetryPage },
  { path: 'preparing', title: 'Preparing Oracle', component: PreparingOraclePage },
  { path: 'birth-result', title: 'Birth Aura Result', component: BirthAuraResultPage },
] as const;
