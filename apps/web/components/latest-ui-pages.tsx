/* eslint-disable @next/next/no-img-element */
"use client";

import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

const A = "/aura-assets/";
const demoCardId = "demo-card";
const holdMs = 2000;

const storageKeys = {
  birthAura: "auracue:h5:birth-aura:v1",
  checkIn: "auracue:h5:check-in:v1",
  selectedCard: "auracue:h5:selected-card:v1",
  oracle: "auracue:h5:oracle:v1",
  history: "auracue:h5:history:v1"
};

type BirthAura = {
  month: string;
  day: string;
  zodiac: string;
  element: string;
  stone: string;
  auraName: string;
  guardianColor: string;
  styleMantra: string;
};

type CheckIn = {
  mood: string;
  scene: string;
};

type Oracle = {
  cardId: string;
  cardName: string;
  auraName: string;
  reason: string;
  luckyColor: string;
  guardianItem: string;
  styleFormula: string;
  affirmation: string;
  sealed: boolean;
  saved: boolean;
};

type HistoryItem = {
  date: string;
  auraName: string;
  cardName: string;
  sealed: boolean;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const days = Array.from({ length: 31 }, (_, index) => String(index + 1));

const moods = [
  ["mood-drained-drop.png", "Drained"],
  ["mood-soft-cloud.png", "Soft"],
  ["mood-restless-swirl.png", "Restless"],
  ["mood-hidden-eye-slash.png", "Hidden"],
  ["mood-focused-target.png", "Focused"],
  ["mood-magnetic-sparkle.png", "Magnetic"],
  ["mood-unbothered-lotus.png", "Unbothered"],
  ["mood-main-character-crown.png", "Main Character"]
];

const scenes = [
  ["intent-work-study-book.png", "Work / Study"],
  ["sparkle_line.png", "Important Moment"],
  ["intent-stay-low-key-lock.png", "Stay Low-Key"],
  ["heart_pink.png", "Just Survive Today"],
  ["intent-need-protection-shield.png", "Need Protection"],
  ["intent-want-to-be-seen-eye.png", "Want to Be Seen"],
  ["intent-social-people.png", "Social"],
  ["intent-soft-reset-arrows.png", "Soft Reset"]
];

const drawCards = ["Card I", "Card II", "Card III"];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function navigate(path: string) {
  window.location.assign(path);
}

function todayLabel() {
  return "Jun 13";
}

function defaultBirthAura(): BirthAura {
  return buildBirthAura("October", "7");
}

function defaultCheckIn(): CheckIn {
  return { mood: "Soft", scene: "Work / Study" };
}

function defaultOracle(): Oracle {
  return buildOracle(defaultBirthAura(), defaultCheckIn(), "Card II");
}

function buildBirthAura(month: string, day: string): BirthAura {
  const monthIndex = Math.max(0, months.indexOf(month));
  const profileByQuarter = [
    { zodiac: "Aries", element: "Fire", stone: "Garnet", auraName: "Mars Flame", color: "Clear Vermilion" },
    { zodiac: "Cancer", element: "Water", stone: "Pearl", auraName: "Moon Water", color: "Pearl Moonlight" },
    { zodiac: "Libra", element: "Air", stone: "Opal", auraName: "Venus Air", color: "Soft Opal Pink" },
    { zodiac: "Capricorn", element: "Earth", stone: "Onyx", auraName: "Saturn Earth", color: "Charcoal Navy" }
  ][Math.floor(monthIndex / 3)];

  return {
    month,
    day,
    zodiac: profileByQuarter.zodiac,
    element: profileByQuarter.element,
    stone: profileByQuarter.stone,
    auraName: profileByQuarter.auraName,
    guardianColor: profileByQuarter.color,
    styleMantra: `I move with ${profileByQuarter.element.toLowerCase()} energy and choose what protects my luck.`
  };
}

function buildOracle(birthAura: BirthAura, checkIn: CheckIn, selectedCard: string): Oracle {
  const cardNames: Record<string, string> = {
    "Card I": "The Star",
    "Card II": "Strength",
    "Card III": "Temperance"
  };
  const auraNames: Record<string, string> = {
    "Card I": "Clean Renewal",
    "Card II": "Soft Boundary",
    "Card III": "Quiet Alignment"
  };
  const cardName = cardNames[selectedCard] ?? "Strength";
  const auraName = auraNames[selectedCard] ?? "Soft Boundary";

  return {
    cardId: demoCardId,
    cardName,
    auraName,
    reason: `You arrived feeling ${checkIn.mood.toLowerCase()} for ${checkIn.scene.toLowerCase()}. ${cardName} speaks through ${birthAura.auraName}, asking you to dress for calm power before you answer the day.`,
    luckyColor: selectedCard === "Card I" ? "Opal White" : selectedCard === "Card III" ? "Mist Lavender" : "Charcoal Navy",
    guardianItem: selectedCard === "Card I" ? "Silver Detail" : selectedCard === "Card III" ? "Soft Knit Layer" : "Structured Jacket",
    styleFormula: selectedCard === "Card I" ? "Light base + reflective accent" : selectedCard === "Card III" ? "Fluid layer + quiet texture" : "Soft layer + clean outer shape",
    affirmation: selectedCard === "Card II" ? "I protect my peace with grace." : "I let the right energy meet me.",
    sealed: false,
    saved: false
  };
}

function useStoredValue<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readJson(key, fallbackRef.current));
  }, [key]);

  return value;
}

function saveHistory(oracle: Oracle) {
  const existing = readJson<HistoryItem[]>(storageKeys.history, []);
  const nextItem = {
    date: todayLabel(),
    auraName: oracle.auraName,
    cardName: oracle.cardName,
    sealed: oracle.sealed
  };
  const withoutDuplicate = existing.filter((item) => item.date !== nextItem.date || item.auraName !== nextItem.auraName);
  writeJson(storageKeys.history, [nextItem, ...withoutDuplicate].slice(0, 8));
}

function ensureOracle() {
  const birthAura = readJson(storageKeys.birthAura, defaultBirthAura());
  const checkIn = readJson(storageKeys.checkIn, defaultCheckIn());
  const selectedCard = readJson(storageKeys.selectedCard, "Card II");
  const oracle = readJson(storageKeys.oracle, buildOracle(birthAura, checkIn, selectedCard));
  writeJson(storageKeys.oracle, oracle);
  return oracle;
}

function StatusBar() {
  return (
    <div className="latest-status" aria-hidden="true">
      <span>9:41</span>
      <i />
    </div>
  );
}

function Logo({ subtitle }: { subtitle?: string }) {
  return (
    <header className="latest-logo">
      <img src={`${A}lotus-logo.png`} alt="" />
      <strong>AuraCue</strong>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}

function Phone({ children, className = "", nav }: { children: ReactNode; className?: string; nav?: "home" | "my" }) {
  return (
    <main className={`latest-phone ${className}`}>
      <HydrationMarker />
      <StatusBar />
      {children}
      {nav ? <BottomNav active={nav} /> : null}
      <div className="latest-home-indicator" aria-hidden="true" />
    </main>
  );
}

function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.auracueHydrated = "true";
  }, []);

  return null;
}

function Back({ href = "/home", tone = "blue" }: { href?: string; tone?: "blue" | "gold" }) {
  return <a className={`latest-back latest-back--${tone}`} href={href} aria-label="Back">&larr;</a>;
}

function Button({
  href,
  onClick,
  children,
  className = "",
  disabled = false
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const content = <><span>*</span>{children}<span>*</span></>;
  if (href && !disabled) {
    return (
      <a
        className={`latest-cta ${className}`}
        href={href}
        onClick={onClick ? (event) => {
          event.preventDefault();
          onClick();
        } : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <button className={`latest-cta ${className}`} type="button" onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

function OutlineButton({ href, onClick, children }: { href?: string; onClick?: () => void; children: ReactNode }) {
  if (href) return <a className="latest-outline" href={href}>{children}<span>*</span></a>;
  return <button className="latest-outline" type="button" onClick={onClick}>{children}<span>*</span></button>;
}

function Divider() {
  return <div className="latest-divider" aria-hidden="true"><span /><b>*</b><span /></div>;
}

function BottomNav({ active }: { active: "home" | "my" }) {
  return (
    <nav className="latest-bottom-nav" aria-label="Bottom navigation">
      <a className={active === "home" ? "active" : ""} href="/home">
        <img src={`${A}${active === "home" ? "home_purple.png" : "home_gold.png"}`} alt="" />
        <span>Home</span>
      </a>
      <i />
      <a className={active === "my" ? "active" : ""} href="/my">
        <img src={`${A}user_gray.png`} alt="" />
        <span>My</span>
      </a>
    </nav>
  );
}

export function LatestHomePage() {
  const birthAura = useStoredValue<BirthAura | null>(storageKeys.birthAura, null);
  const hasBirthAura = Boolean(birthAura);

  return (
    <Phone className="latest-home" nav="home">
      <Logo subtitle="Your Daily Tarot Style Oracle" />
      <div className="latest-date-chip"><img src={`${A}calendar-star.png`} alt="" />Jun 13 | Saturday</div>
      <section className="latest-planet-hero">
        <img className="latest-hero-woman" src={`${A}hero-woman.png`} alt="" />
        <p>Today&apos;s Ruling Planet</p>
        <h1>Saturn</h1>
        <Divider />
        <div className="latest-traits">
          <span><img src={`${A}shield.png`} alt="" />Structure</span>
          <span><img src={`${A}lock.png`} alt="" />Boundaries</span>
          <span><img src={`${A}scales.png`} alt="" />Stability</span>
        </div>
      </section>
      <Button href={hasBirthAura ? "/today/check-in" : "/onboarding/birth-aura"}>
        {hasBirthAura ? "Begin Today's Ritual" : "Start My First Aura"}
      </Button>
    </Phone>
  );
}

export function LatestBirthdayPage() {
  const storedBirthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const [month, setMonth] = useState("October");
  const [day, setDay] = useState("7");

  useEffect(() => {
    setMonth(storedBirthAura.month);
    setDay(storedBirthAura.day);
  }, [storedBirthAura.day, storedBirthAura.month]);

  const preview = useMemo(() => buildBirthAura(month, day), [day, month]);
  const canContinue = Boolean(month && day);

  function submitBirthday() {
    const birthAura = buildBirthAura(month, day);
    writeJson(storageKeys.birthAura, birthAura);
    navigate("/onboarding/birth-aura/reveal");
  }

  return (
    <Phone className="latest-birthday">
      <Back />
      <Logo />
      <section className="latest-title">
        <h1>Enter Your Birthday</h1>
        <p>Your birthday becomes the key to how each card speaks to you.</p>
      </section>
      <section className="latest-picker" aria-label="Birthday picker">
        <label>
          <b>Month</b>
          <select className="latest-select" value={month} onChange={(event) => setMonth(event.target.value)}>
            {months.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <b>Day</b>
          <select className="latest-select" value={day} onChange={(event) => setDay(event.target.value)}>
            {days.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>
      <p className="latest-note">Preview: {preview.auraName} | {preview.zodiac} | {preview.element}</p>
      <p className="latest-safe"><img src={`${A}privacy-lock-badge.png`} alt="" />Your birthday is private and never shared.</p>
      <Button href="/onboarding/birth-aura/reveal" onClick={submitBirthday} disabled={!canContinue}>Continue</Button>
    </Phone>
  );
}

export function LatestBirthRevealPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());

  return (
    <Phone className="latest-birth-reveal">
      <Back href="/onboarding/birth-aura" />
      <Logo />
      <Divider />
      <section className="latest-title">
        <span>Your Birth Aura is</span>
        <h1>{birthAura.auraName}</h1>
      </section>
      <div className="latest-tags"><span>{birthAura.zodiac}</span><span>{birthAura.element}</span><span>{birthAura.stone}</span></div>
      <article className="latest-quote">You carry luck through balance, beauty, and subtle attraction.</article>
      <article className="latest-guardian">
        <img src={`${A}birth-aura-venus-air-orb.png`} alt="" />
        <div><small>Your First Guardian Color</small><h2>{birthAura.guardianColor}</h2><p>{birthAura.styleMantra}</p></div>
      </article>
      <Button href="/today/check-in">Begin Today&apos;s Ritual</Button>
      <p className="latest-note">You can edit this later in My Aura.</p>
    </Phone>
  );
}

export function LatestCheckInPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const [mood, setMood] = useState("");
  const [scene, setScene] = useState("");
  const canContinue = Boolean(mood && scene);

  function submitCheckIn() {
    writeJson(storageKeys.checkIn, { mood, scene });
    navigate("/today/draw");
  }

  return (
    <Phone className="latest-checkin" nav="home">
      <Back />
      <Logo />
      <div className="latest-pill-row"><span>Jun 13 | Saturn</span><span>Birth Aura: {birthAura.auraName}</span></div>
      <section className="latest-panel">
        <Divider />
        <h1>How are you arriving today?</h1>
        <div className="latest-choice-grid latest-choice-grid--mood">
          {moods.map(([icon, label]) => (
            <button
              aria-pressed={mood === label}
              className={mood === label ? "selected" : ""}
              key={label}
              onClick={() => setMood(label)}
              type="button"
            >
              <img src={`${A}${icon}`} alt="" />{label}
            </button>
          ))}
        </div>
        <Divider />
        <h2>What is today asking from you?</h2>
        <div className="latest-choice-grid">
          {scenes.map(([icon, label]) => (
            <button
              aria-pressed={scene === label}
              className={scene === label ? "selected" : ""}
              key={label}
              onClick={() => setScene(label)}
              type="button"
            >
              <img src={`${A}${icon}`} alt="" />{label}
            </button>
          ))}
        </div>
      </section>
      <Button href="/today/draw" onClick={submitCheckIn} disabled={!canContinue}>Continue to Your Card</Button>
    </Phone>
  );
}

export function LatestDrawPage() {
  const [selectedCard, setSelectedCard] = useState("");
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const checkIn = useStoredValue(storageKeys.checkIn, defaultCheckIn());

  function reveal() {
    const oracle = buildOracle(birthAura, checkIn, selectedCard);
    writeJson(storageKeys.selectedCard, selectedCard);
    writeJson(storageKeys.oracle, oracle);
    navigate("/today/reading");
  }

  return (
    <Phone className="latest-draw" nav="home">
      <Back href="/today/check-in" />
      <a className="latest-gift" href="/my">*</a>
      <Logo subtitle="Your Daily Tarot Style Oracle" />
      <Divider />
      <section className="latest-title">
        <h1>Choose the card<br />that calls you.</h1>
        <p>Take one breath. Let today&apos;s aura find you.</p>
      </section>
      <section className="latest-card-stage" aria-label="Tarot card choices">
        {drawCards.map((label, index) => (
          <button
            aria-pressed={selectedCard === label}
            className={`latest-tarot latest-tarot-${index} ${selectedCard === label ? "selected" : ""}`}
            key={label}
            onClick={() => setSelectedCard(label)}
            type="button"
          >
            <img src={`${A}tarot-card-back-card2.png`} alt="" /><b>{label}</b>
          </button>
        ))}
      </section>
      <p className="latest-note">{selectedCard ? `${selectedCard} is listening.` : "Tap one card to draw today's aura."}</p>
      <Button href="/today/reading" onClick={reveal} disabled={!selectedCard}>Reveal My Aura</Button>
    </Phone>
  );
}

export function LatestReadingPage() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    ensureOracle();
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 16));
    }, 250);
    const navigationTimer = window.setTimeout(() => {
      setReady(true);
      navigate(`/result/${demoCardId}`);
    }, 1700);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <Phone className="latest-reading">
      <Back href="/today/draw" />
      <Logo />
      <section className="latest-title">
        <h1>Reading your aura...</h1>
        <p>Birth Aura | Today&apos;s Ruling Planet | Chosen Card</p>
      </section>
      <section className="latest-orbit"><img src={`${A}tarot-card-back-card2.png`} alt="" /></section>
      <p className="latest-note">{ready ? "Your aura is ready." : "Gathering your style oracle"}</p>
      <div className="latest-loading" aria-label={`Reading progress ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <Button href={`/result/${demoCardId}`}>View Today&apos;s Aura</Button>
    </Phone>
  );
}

export function LatestResultPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const checkIn = useStoredValue(storageKeys.checkIn, defaultCheckIn());
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());

  return (
    <Phone className="latest-result">
      <Back href="/today/draw" />
      <a className="latest-gift" href="/my">*</a>
      <Logo subtitle="Your Daily Tarot Style Oracle" />
      <div className="latest-date-chip small">Jun 13 | Saturday</div>
      <section className="latest-result-planet">
        <p>Today&apos;s Ruling Planet</p>
        <h1>Saturn</h1>
        <div className="latest-traits"><span>Structure</span><span>Boundaries</span><span>Stability</span></div>
      </section>
      <section className="latest-aura-summary"><div><p>Today&apos;s Aura</p><h2>{oracle.cardName}</h2><h3>{oracle.auraName}</h3></div><img src={`${A}shield-growth.png`} alt="" /></section>
      <section className="latest-why"><h3>* Why this card found you today</h3><p>{oracle.reason}</p><p className="latest-context-note">{birthAura.auraName} | {checkIn.mood} | {checkIn.scene}</p></section>
      <h2 className="latest-style-title">* Today&apos;s Style Cue *</h2>
      <div className="latest-style-list"><span>Lucky Color <b>{oracle.luckyColor}</b></span><span>Guardian Item <b>{oracle.guardianItem}</b></span><span>Style Formula <b>{oracle.styleFormula}</b></span></div>
      <Button href={`/activate/${demoCardId}`}>Seal Today&apos;s Aura</Button>
    </Phone>
  );
}

export function LatestActivatePage() {
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  function clearHold() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
    setHolding(false);
    setProgress(0);
  }

  function startHold() {
    setHolding(true);
    setProgress(0);
    const started = Date.now();
    intervalRef.current = window.setInterval(() => {
      setProgress(Math.min(100, Math.round(((Date.now() - started) / holdMs) * 100)));
    }, 80);
    timerRef.current = window.setTimeout(() => {
      const sealedOracle = { ...oracle, sealed: true };
      writeJson(storageKeys.oracle, sealedOracle);
      saveHistory(sealedOracle);
      navigate(`/activated/${demoCardId}`);
    }, holdMs);
  }

  return (
    <Phone className="latest-activate">
      <Back href={`/result/${demoCardId}`} />
      <Logo />
      <section className="latest-title"><h1>Hold to Seal</h1><p>Press and carry today&apos;s aura with you.</p></section>
      <section className="latest-seal-orb"><img src={`${A}seal-orb-pink.png`} alt="" /><h2>{oracle.auraName}</h2><Divider /><p>{oracle.affirmation}</p></section>
      <button
        className="latest-cta latest-hold"
        onPointerCancel={clearHold}
        onPointerDown={startHold}
        onPointerLeave={clearHold}
        onPointerUp={clearHold}
        style={{ "--latest-hold-progress": `${progress}%` } as CSSProperties}
        type="button"
      >
        <span>*</span>{holding ? "Keep Holding" : "Hold to Seal"}<span>*</span>
      </button>
      <p className="latest-note">{holding ? `${progress}% sealed` : "2 seconds to activate"}</p>
    </Phone>
  );
}

export function LatestActivatedPage() {
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());

  function saveCard() {
    const savedOracle = { ...oracle, saved: true, sealed: true };
    writeJson(storageKeys.oracle, savedOracle);
    saveHistory(savedOracle);
    navigate(`/saved/${demoCardId}`);
  }

  return (
    <Phone className="latest-activated">
      <Back href={`/activate/${demoCardId}`} tone="gold" />
      <Logo />
      <section className="latest-sealed-hero"><img src={`${A}hero_woman_lion.png`} alt="" /><h2>* {oracle.auraName} *</h2></section>
      <section className="latest-title"><h1>* Aura Sealed *</h1><Divider /><p>June 13 aura is active.</p></section>
      <div className="latest-style-list"><span>Lucky Color <b>{oracle.luckyColor}</b></span><span>Guardian Item <b>{oracle.guardianItem}</b></span></div>
      <Button href={`/share/${demoCardId}`}>Share Story</Button>
      <OutlineButton onClick={saveCard}>Save Card</OutlineButton>
      <OutlineButton href="/home">Done</OutlineButton>
    </Phone>
  );
}

export function LatestSharePage() {
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());
  const [message, setMessage] = useState("9:16 Share Card Preview");

  return (
    <Phone className="latest-share">
      <Back href={`/activated/${demoCardId}`} tone="gold" />
      <Logo />
      <section className="latest-title"><h1>Share Today&apos;s Aura</h1><p>Send your daily oracle as a beautiful story card.</p><Divider /></section>
      <article className="latest-story-card" aria-label="9:16 share preview">
        <div className="latest-story-card__brand">
          <img src={`${A}lotus-logo.png`} alt="" />
          <strong>AuraCue</strong>
        </div>
        <span className="latest-story-card__spark">*</span>
        <small>Today&apos;s Aura</small>
        <h2>{oracle.auraName}</h2>
        <p>* June 13 aura is active *</p>
        <img className="latest-story-card__portrait" src={`${A}hero-woman.png`} alt="" />
        <div className="latest-story-card__details">
          <span><b className="latest-swatch latest-swatch--navy" />Lucky Color <strong>{oracle.luckyColor}</strong></span>
          <span><b className="latest-swatch latest-swatch--jacket" />Guardian Item <strong>{oracle.guardianItem}</strong></span>
        </div>
      </article>
      <p className="latest-note">{message}</p>
      <Button onClick={() => setMessage("Share sheet opened")}>Share Story</Button>
      <OutlineButton onClick={() => setMessage("Download image prepared")}>Download Image</OutlineButton>
      <OutlineButton onClick={() => setMessage("Copy Link complete")}>Copy Link</OutlineButton>
    </Phone>
  );
}

export function LatestSavedPage() {
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());

  useEffect(() => {
    const savedOracle = { ...readJson(storageKeys.oracle, defaultOracle()), saved: true };
    writeJson(storageKeys.oracle, savedOracle);
    saveHistory(savedOracle);
  }, []);

  return (
    <Phone className="latest-saved">
      <Logo />
      <section className="latest-title"><h1>Saved</h1><p>Your aura card has been saved to My Aura.</p></section>
      <section className="latest-sealed-hero"><img src={`${A}hero_woman_lion.png`} alt="" /><h2>{oracle.auraName}</h2></section>
      <Button href="/my">View My Aura</Button>
      <OutlineButton href="/home">Back Home</OutlineButton>
    </Phone>
  );
}

export function LatestMyPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const history = useStoredValue<HistoryItem[]>(storageKeys.history, [
    { date: "Jun 12", auraName: "Clean Renewal", cardName: "The Star", sealed: true },
    { date: "Jun 11", auraName: "Quiet Power", cardName: "The Hermit", sealed: false }
  ]);
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());

  return (
    <Phone className="latest-my" nav="my">
      <div className="latest-my-actions"><img src={`${A}avatar_woman.png`} alt="" /><a href="/my/birth-aura" aria-label="Birth Aura settings">Settings</a></div>
      <Logo />
      <section className="latest-title"><h1>My Aura</h1><p>Your personal aura space.</p></section>
      <article className="latest-profile-card"><img src={`${A}birth_lotus_medallion.png`} alt="" /><div><span>Birth Aura *</span><h2>{birthAura.auraName}</h2><p>{birthAura.zodiac} | {birthAura.element} | {birthAura.stone}</p><b>{birthAura.guardianColor}</b></div><a href="/my/birth-aura" aria-label="Open Birth Aura profile">&gt;</a></article>
      <article className="latest-profile-card"><img src={`${A}moon_medallion.png`} alt="" /><div><span>Today *</span><h2>{oracle.auraName}</h2><p>{oracle.luckyColor} | {oracle.guardianItem}</p></div><a href={`/activated/${demoCardId}`} aria-label="Open today's sealed aura">&gt;</a></article>
      <section className="latest-history">
        <h2>Aura History *</h2>
        {history.map((item) => <p key={`${item.date}-${item.auraName}`}>{item.date} | {item.auraName} | {item.sealed ? "Sealed" : "Open"}</p>)}
      </section>
    </Phone>
  );
}

export function LatestBirthProfilePage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());

  return (
    <Phone className="latest-birth-profile" nav="my">
      <Back href="/my" tone="gold" />
      <Logo subtitle="Your Daily Tarot Style Oracle" />
      <section className="latest-title"><h1>Birth Aura</h1></section>
      <article className="latest-guardian large"><img src={`${A}birth_lotus_medallion.png`} alt="" /><div><h2>{birthAura.auraName}</h2><Divider /><p>{birthAura.zodiac} | {birthAura.element} | {birthAura.stone}</p></div></article>
      <div className="latest-style-list"><span>Guardian Color <b>{birthAura.guardianColor}</b></span><span>Style Mantra <b>{birthAura.styleMantra}</b></span><span>Birthday <b>{birthAura.month} {birthAura.day}</b></span></div>
      <p className="latest-safe">Changing your birthday will update future readings. Past sealed cards will stay unchanged.</p>
      <Button href="/onboarding/birth-aura">Edit Birthday</Button>
    </Phone>
  );
}

export function LatestPrivacyPage() {
  return (
    <Phone className="latest-legal" nav="my">
      <Back href="/my" tone="gold" />
      <Logo />
      <section className="latest-title"><h1>Privacy</h1><p>Your birthday and aura history stay private on this device in the H5 prototype.</p></section>
      <div className="latest-style-list">
        <span>Birthday <b>Month and day only</b></span>
        <span>Personalization <b>Used only for Birth Aura and readings</b></span>
        <span>Sharing <b>Only the card preview is shared when you choose it</b></span>
      </div>
      <Button href="/my">Back to My Aura</Button>
    </Phone>
  );
}

export function LatestTermsPage() {
  return (
    <Phone className="latest-legal" nav="my">
      <Back href="/my" tone="gold" />
      <Logo />
      <section className="latest-title"><h1>Terms</h1><p>AuraCue offers style inspiration and reflective prompts. It is not medical, legal, or financial advice.</p></section>
      <div className="latest-style-list">
        <span>Use <b>Personal entertainment and styling guidance</b></span>
        <span>Cards <b>Generated as daily oracle content</b></span>
        <span>Saved Aura <b>You can revisit saved cards from My Aura</b></span>
      </div>
      <Button href="/my">Back to My Aura</Button>
    </Phone>
  );
}

export function LatestErrorPage() {
  return (
    <Phone className="latest-error">
      <Back href="/home" />
      <Logo />
      <section className="latest-error-card"><img src={`${A}tarot-card-back-tilt.png`} alt="" /></section>
      <section className="latest-title"><h1>Your aura slipped away for a second.</h1><Divider /><p>Let&apos;s reconnect and try again.</p></section>
      <Button href="/today/draw">Try Again</Button>
      <OutlineButton href="/today/check-in">Change Context</OutlineButton>
    </Phone>
  );
}
