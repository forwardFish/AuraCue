import { icons } from './assets';
import {
  AuraLogo,
  BackButton,
  BookmarkIcon,
  BottomNav,
  Chevron,
  ChoiceChip,
  ColorSwatch,
  DownloadIcon,
  GearIcon,
  GradientButton,
  JacketIllustration,
  LinkIcon,
  OutlineButton,
  PencilIcon,
  ScreenChrome,
  SectionDivider,
  ShareIcon,
  TopPill,
  goTo
} from './components';

const moodChoices = [
  { icon: icons.drop, label: 'Drained' },
  { icon: icons.cloud, label: 'Soft', selected: true },
  { icon: icons.swirl, label: 'Restless' },
  { icon: icons.eyeSlash, label: 'Hidden' },
  { icon: icons.target, label: 'Focused', selected: true },
  { icon: icons.sparkleLine, label: 'Magnetic' },
  { icon: icons.lotusLine, label: 'Unbothered', wide: true },
  { icon: icons.crown, label: 'Main Character', wide: true }
];

const intentChoices = [
  { icon: icons.book, label: 'Work / Study', selected: true },
  { icon: icons.sparkleLine, label: 'Important Moment' },
  { icon: icons.lock, label: 'Stay Low-Key' },
  { icon: icons.heartPink, label: 'Just Survive Today' },
  { icon: icons.shield, label: 'Need Protection' },
  { icon: icons.eye, label: 'Want to Be Seen' },
  { icon: icons.people, label: 'Social' },
  { icon: icons.refresh, label: 'Soft Reset', selected: true }
];

export function RitualCheckInPage() {
  return (
    <ScreenChrome className="screen-ritual">
      <BackButton />
      <AuraLogo />

      <div className="top-pill-row">
        <TopPill icon={icons.calendarStar}>Jun 13 · Saturn</TopPill>
        <TopPill icon={icons.venusSymbol}>Birth Aura: Venus Air</TopPill>
      </div>

      <section className="mood-panel card-frame">
        <span className="panel-crescent">☾</span>
        <span className="panel-arch" />
        <SectionDivider />
        <h1>How are you arriving today?</h1>
        <div className="choice-grid mood-grid">
          {moodChoices.map((item) => (
            <ChoiceChip key={item.label} {...item} />
          ))}
        </div>
        <SectionDivider className="mid-divider" />
        <h2>What is today asking from you?</h2>
        <div className="choice-grid intent-grid">
          {intentChoices.map((item) => (
            <ChoiceChip key={item.label} {...item} />
          ))}
        </div>
      </section>

      <GradientButton onClick={() => goTo('sealed')}>Continue to Your Card</GradientButton>
    </ScreenChrome>
  );
}

export function ShareAuraPage() {
  return (
    <ScreenChrome className="screen-share">
      <BackButton tone="gold" />
      <AuraLogo />
      <section className="page-heading compact">
        <h1>Share Today’s Aura</h1>
        <p>Send your daily oracle as a beautiful story card.</p>
        <SectionDivider />
      </section>

      <article className="story-preview card-frame">
        <div className="story-art">
          <img src={icons.heroWoman} alt="" />
          <div className="story-text-top">
            <img src={icons.lotusLogo} alt="" />
            <span>AuraCue</span>
            <b>✦</b>
            <em>Today’s Aura</em>
            <h2>Soft Boundary</h2>
            <p>✦ June 13 aura is active ✦</p>
          </div>
          <div className="story-info-list">
            <div className="story-info-row">
              <ColorSwatch />
              <span><b>Lucky Color</b>Charcoal Navy</span>
              <i>✦</i>
            </div>
            <div className="story-info-row">
              <JacketIllustration />
              <span><b>Guardian Item</b>Structured Jacket</span>
              <i>✦</i>
            </div>
          </div>
          <div className="story-lotus">⌁ ✧ <img src={icons.pinkLotus} alt="" /> ✧ ⌁</div>
        </div>
      </article>

      <p className="preview-caption">✦ 9:16 Share Card Preview ✦</p>
      <div className="button-stack">
        <GradientButton icon={<ShareIcon />}>Share Story</GradientButton>
        <OutlineButton icon={<DownloadIcon />}>Download Image</OutlineButton>
        <OutlineButton icon={<LinkIcon />}>Copy Link</OutlineButton>
      </div>
    </ScreenChrome>
  );
}

export function AuraSealedPage() {
  return (
    <ScreenChrome className="screen-sealed">
      <BackButton tone="gold" />
      <AuraLogo />

      <section className="sealed-hero card-frame">
        <img src={icons.heroWoman} alt="" />
        <div className="sealed-hero-title">✦ Soft Boundary ✦</div>
        <SectionDivider />
      </section>

      <section className="page-heading sealed-title">
        <h1>✦ Aura Sealed ✦</h1>
        <SectionDivider />
        <p>June 13 aura is active.</p>
      </section>

      <section className="style-cue">
        <div className="style-cue-title"><span />Today’s Style Cue<span /></div>
        <button className="cue-row" type="button">
          <ColorSwatch />
          <span><b>Lucky Color</b>Charcoal Navy</span>
          <Chevron />
        </button>
        <button className="cue-row" type="button">
          <JacketIllustration />
          <span><b>Guardian Item</b>Structured Jacket</span>
          <Chevron />
        </button>
      </section>

      <div className="button-stack sealed-buttons">
        <GradientButton icon={<ShareIcon />} onClick={() => goTo('share')}>Share Story</GradientButton>
        <OutlineButton icon={<BookmarkIcon />}>Save Card</OutlineButton>
        <OutlineButton onClick={() => goTo('ritual')}>Done</OutlineButton>
      </div>
    </ScreenChrome>
  );
}

export function BirthAuraPage() {
  return (
    <ScreenChrome className="screen-birth">
      <BackButton tone="gold" />
      <AuraLogo subtitle="Your Daily Tarot Style Oracle" />
      <section className="page-heading birth-heading">
        <h1>Birth Aura</h1>
      </section>

      <section className="birth-feature card-frame">
        <div className="birth-medallion">
          <img src={icons.birthLotusMedallion} alt="" />
        </div>
        <div className="birth-feature-text">
          <h2>Venus Air</h2>
          <SectionDivider />
          <p>Libra · Air · Opal</p>
        </div>
      </section>

      <section className="info-card-row color-card">
        <img src={icons.goldSparkle} alt="" />
        <div><b>Guardian Color</b><span>Soft Opal Pink</span></div>
        <img className="swatch-img" src={icons.softOpalSwatch} alt="" />
      </section>

      <section className="info-card-row">
        <img src={icons.goldSparkle} alt="" />
        <div><b>Style Mantra</b><span>I attract through balance, not effort.</span></div>
      </section>

      <section className="info-card-row birthday-row">
        <img src={icons.calendarStar} alt="" />
        <div><b>Birthday</b><span>Oct 07</span></div>
        <button type="button">Edit Birthday <Chevron /></button>
      </section>

      <section className="notice-card">
        <img src={icons.infoIcon} alt="" />
        <p>Changing your birthday will update future readings.<br />Past sealed cards will stay unchanged.</p>
      </section>

      <BottomNav active="home" />
    </ScreenChrome>
  );
}

const historyRows = [
  { icon: icons.lockBadge, date: 'Jun 13', name: 'Soft Boundary', status: 'Sealed' },
  { icon: icons.flowerPink, date: 'Jun 12', name: 'Clean Renewal', status: 'Sealed' },
  { icon: icons.starMedallion, date: 'Jun 11', name: 'Quiet Power', status: '' }
];

export function MyAuraPage() {
  return (
    <ScreenChrome className="screen-my">
      <div className="my-top-actions">
        <button className="avatar-button" type="button"><img src={icons.avatarWoman} alt="" /><span /></button>
        <button className="settings-button" type="button"><GearIcon /></button>
      </div>
      <AuraLogo />
      <section className="page-heading my-heading">
        <h1>My Aura</h1>
        <p>Your personal aura space.</p>
        <div className="cosmic-line">· · ✦ · ☽ · ✧ · ☾ · ✦ · ·</div>
      </section>

      <section className="profile-card card-frame birth-card">
        <img className="profile-medallion" src={icons.birthLotusMedallion} alt="" />
        <div className="profile-copy">
          <span>Birth Aura ✦</span>
          <h2>Venus Air</h2>
          <p>Libra · Air · Opal</p>
          <b><i /> Soft Opal Pink</b>
        </div>
        <button className="round-action" type="button"><PencilIcon /></button>
      </section>

      <section className="profile-card card-frame today-card">
        <img className="profile-medallion" src={icons.moonMedallion} alt="" />
        <div className="profile-copy">
          <span>Today ✦</span>
          <h2>Soft Boundary</h2>
          <p>Charcoal Navy ·<br />Structured Jacket</p>
        </div>
        <button className="round-action" type="button"><Chevron /></button>
      </section>

      <section className="history-panel card-frame">
        <header>
          <h2>Aura History ✦</h2>
          <button type="button">This Week <Chevron /></button>
        </header>
        <div className="history-list">
          {historyRows.map((row) => (
            <button className="history-row" type="button" key={row.date}>
              <img src={row.icon} alt="" />
              <span>{row.date}</span>
              <i>·</i>
              <span>{row.name}</span>
              {row.status ? <><i>·</i><span>{row.status}</span></> : null}
              <Chevron />
            </button>
          ))}
        </div>
        <div className="history-ornament">· ✦ · ☾ · ✧ · ☽ · ✦ ·</div>
      </section>

      <BottomNav active="my" />
    </ScreenChrome>
  );
}
