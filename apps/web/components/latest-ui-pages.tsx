/* eslint-disable @next/next/no-img-element */
"use client";

import type * as React from "react";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client.js";

const A = "/aura-assets/";
const tarotBackAsset = "p0-05-tarot-card-back-clean.png";
const demoCardId = "demo-card";
const holdMs = 2000;

const storageKeys = {
  anonymousId: "auracue:h5:anonymous-id:v1",
  birthAura: "auracue:h5:birth-aura:v1",
  checkIn: "auracue:h5:check-in:v1",
  selectedCard: "auracue:h5:selected-card:v1",
  drawSessionId: "auracue:h5:draw-session-id:v1",
  generationJobId: "auracue:h5:generation-job-id:v1",
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

type HomeTrait = {
  label: string;
  icon: string;
  pillImage?: string;
};

type HomeContent = {
  dateLabel: string;
  weekdayLabel: string;
  rulingPlanet: string;
  traits: HomeTrait[];
  firstAuraCta: string;
  ritualCta: string;
  firstAuraHref: string;
  ritualHref: string;
};

const fallbackHomeContent: HomeContent = {
  dateLabel: "Jun 13",
  weekdayLabel: "Saturday",
  rulingPlanet: "Saturn",
  traits: [
    { label: "Structure", icon: "shield.png" },
    { label: "Boundaries", icon: "lock.png" },
    { label: "Stability", icon: "scales.png" }
  ],
  firstAuraCta: "Start My First Aura",
  ritualCta: "Begin Today's Ritual",
  firstAuraHref: "/onboarding/birth-aura",
  ritualHref: "/today/check-in"
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

function wheelItems(values: string[], selected: string, radius = 2) {
  const selectedIndex = Math.max(values.indexOf(selected), 0);
  return Array.from({ length: radius * 2 + 1 }, (_, index) => {
    const offset = index - radius;
    const value = values[(selectedIndex + offset + values.length) % values.length];
    return { value, offset };
  });
}

function adjacentWheelValue(values: string[], selected: string, direction: 1 | -1) {
  const selectedIndex = Math.max(values.indexOf(selected), 0);
  return values[(selectedIndex + direction + values.length) % values.length];
}

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

function readString(key: string) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) || "";
}

function writeString(key: string, value: string) {
  window.localStorage.setItem(key, value);
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
  return { mood: "Drained", scene: "Work / Study" };
}

function defaultOracle(): Oracle {
  return buildOracle(defaultBirthAura(), defaultCheckIn(), "Card II");
}

function buildBirthAura(month: string, day: string): BirthAura {
  if (month === "October" && day === "7") {
    return {
      month,
      day,
      zodiac: "Libra",
      element: "Air",
      stone: "Opal",
      auraName: "Venus Air",
      guardianColor: "Soft Opal Pink",
      styleMantra: "Harmony, charm, and gentle magnetism."
    };
  }

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

function selectedCardPosition(selectedCard: string) {
  const index = drawCards.indexOf(selectedCard);
  return index >= 0 ? index + 1 : 2;
}

async function ensureAnonymousIdentity() {
  const existing = readString(storageKeys.anonymousId);
  if (existing) return existing;

  const identity = await apiClient.createAnonymousIdentity({
    platform: "web",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai"
  }) as { anonymousId: string };
  writeString(storageKeys.anonymousId, identity.anonymousId);
  return identity.anonymousId;
}

function oracleFromGeneratedCard(
  card: { cardId?: string; content?: Record<string, unknown> },
  fallback: Oracle
): Oracle {
  const content = card.content || {};
  const stringOr = (value: unknown, fallbackValue: string) => typeof value === "string" && value.trim() ? value.trim() : fallbackValue;
  const luckyColors = Array.isArray(content.colors) ? content.colors.filter((item): item is string => typeof item === "string") : [];
  return {
    ...fallback,
    cardId: stringOr(card.cardId, fallback.cardId),
    cardName: stringOr(content.tarotSymbol, fallback.cardName),
    auraName: stringOr(content.auraName, stringOr(content.title, fallback.auraName)),
    reason: stringOr(content.message, fallback.reason),
    luckyColor: stringOr(content.luckyColor, luckyColors[0] || fallback.luckyColor),
    guardianItem: stringOr(content.outfit, fallback.guardianItem),
    styleFormula: stringOr(content.beauty, stringOr(content.outfit, fallback.styleFormula)),
    affirmation: stringOr(content.caption, fallback.affirmation),
    sealed: false,
    saved: false
  };
}

async function generateOracleFromApi(birthAura: BirthAura, checkIn: CheckIn, selectedCard: string) {
  const fallback = buildOracle(birthAura, checkIn, selectedCard);
  const anonymousId = await ensureAnonymousIdentity();
  const drawSession = await apiClient.startDrawSession({
    anonymousId,
    platform: "web",
    mood: checkIn.mood,
    context: checkIn.scene
  }) as { drawSessionId: string };
  writeString(storageKeys.drawSessionId, drawSession.drawSessionId);

  const generation = await apiClient.generateAuraCard({
    anonymousId,
    platform: "web",
    drawSessionId: drawSession.drawSessionId,
    drawPosition: selectedCardPosition(selectedCard),
    locale: "en-US"
  }) as { jobId: string; cardId: string | null };
  writeString(storageKeys.generationJobId, generation.jobId);

  if (!generation.cardId) {
    return fallback;
  }

  const generatedCard = await apiClient.getAuraCard(generation.cardId) as { cardId: string; content: Record<string, unknown> };
  return oracleFromGeneratedCard(generatedCard, fallback);
}


function useStoredValue<T>(key: string, fallback: T) {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(readJson(key, fallbackRef.current));
  }, [key]);

  return value;
}

function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(fallbackHomeContent);

  useEffect(() => {
    let cancelled = false;
    apiClient.getHomeContent()
      .then((nextContent: HomeContent) => {
        if (!cancelled) {
          setContent(normalizeHomeContent(nextContent));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(fallbackHomeContent);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}

function normalizeHomeContent(content: Partial<HomeContent>): HomeContent {
  return {
    dateLabel: content.dateLabel || fallbackHomeContent.dateLabel,
    weekdayLabel: content.weekdayLabel || fallbackHomeContent.weekdayLabel,
    rulingPlanet: content.rulingPlanet || fallbackHomeContent.rulingPlanet,
    traits: Array.isArray(content.traits) && content.traits.length === 3 ? content.traits as HomeTrait[] : fallbackHomeContent.traits,
    firstAuraCta: content.firstAuraCta || fallbackHomeContent.firstAuraCta,
    ritualCta: content.ritualCta || fallbackHomeContent.ritualCta,
    firstAuraHref: content.firstAuraHref || fallbackHomeContent.firstAuraHref,
    ritualHref: content.ritualHref || fallbackHomeContent.ritualHref
  };
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
      <div className="latest-status-icons">
        <b className="latest-status-signal"><i /><i /><i /><i /></b>
        <b className="latest-status-wifi"><i /><i /><i /></b>
        <b className="latest-status-battery" />
      </div>
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
  const content = <><span>✦</span>{children}<span>✦</span></>;
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

function Divider({ className = "" }: { className?: string }) {
  return <div className={`latest-divider ${className}`} aria-hidden="true"><span /><b>✦</b><span /></div>;
}

function HomeTabIcon() {
  return (
    <svg className="latest-tab-icon latest-tab-icon--home" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="latest-home-icon-fill" x1="6" x2="25" y1="26" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E37C9" />
          <stop offset="1" stopColor="#A065E8" />
        </linearGradient>
      </defs>
      <path d="M6.8 15.4 16 7.8l9.2 7.6v9.4a1.9 1.9 0 0 1-1.9 1.9h-4.7v-7.2h-5.2v7.2H8.7a1.9 1.9 0 0 1-1.9-1.9v-9.4Z" />
    </svg>
  );
}

function ProfileTabIcon() {
  return <img className="latest-tab-icon latest-tab-icon--profile latest-tab-icon--profile-img" src={`${A}p0-05a-my-user-icon.png`} alt="" aria-hidden="true" />;
}

function BottomNav({ active }: { active: "home" | "my" }) {
  return (
    <nav className="latest-bottom-nav" aria-label="Bottom navigation">
      <a className={active === "home" ? "active" : ""} href="/home">
        <HomeTabIcon />
        <span>Home</span>
      </a>
      <i />
      <a className={active === "my" ? "active" : ""} href="/my">
        <ProfileTabIcon />
        <span>My</span>
      </a>
    </nav>
  );
}

export function LatestHomePage() {
  const birthAura = useStoredValue<BirthAura | null>(storageKeys.birthAura, null);
  const homeContent = useHomeContent();
  const hasBirthAura = Boolean(birthAura);
  const ctaHref = hasBirthAura ? homeContent.ritualHref : homeContent.firstAuraHref;
  const ctaLabel = hasBirthAura ? homeContent.ritualCta : homeContent.firstAuraCta;

  return (
    <Phone className="latest-home" nav="home">
      <Logo subtitle="Your Daily Tarot Style Oracle" />
      <div className="latest-date-chip"><img src={`${A}home-date-calendar-icon-original.png`} alt="" />{homeContent.dateLabel} • {homeContent.weekdayLabel}</div>
      <section className="latest-planet-hero">
        <img className="latest-hero-bg" src={`${A}home-saturn-planet-hero-card.png`} alt="" />
        <p>Today&apos;s Ruling Planet</p>
        <Divider className="latest-divider--planet-top" />
        <h1>{homeContent.rulingPlanet}</h1>
        <Divider className="latest-divider--planet-bottom" />
        <div className="latest-traits">
          {homeContent.traits.map((trait) => (
            <span key={trait.label}><img src={`${A}${trait.icon}`} alt="" />{trait.label}</span>
          ))}
        </div>
      </section>
      <Button href={ctaHref}>{ctaLabel}</Button>
    </Phone>
  );
}

export function LatestBirthdayPage() {
  const storedBirthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const [month, setMonth] = useState("October");
  const [day, setDay] = useState("7");
  const monthDragStart = useRef<number | null>(null);
  const dayDragStart = useRef<number | null>(null);

  useEffect(() => {
    setMonth(storedBirthAura.month);
    setDay(storedBirthAura.day);
  }, [storedBirthAura.day, storedBirthAura.month]);

  const preview = useMemo(() => buildBirthAura(month, day), [day, month]);
  const monthWheel = useMemo(() => wheelItems(months, month), [month]);
  const dayWheel = useMemo(() => wheelItems(days, day), [day]);
  const canContinue = Boolean(month && day);

  function submitBirthday() {
    const birthAura = buildBirthAura(month, day);
    writeJson(storageKeys.birthAura, birthAura);
    navigate("/onboarding/birth-aura/reveal");
  }

  function moveMonth(direction: 1 | -1) {
    setMonth((current) => adjacentWheelValue(months, current, direction));
  }

  function moveDay(direction: 1 | -1) {
    setDay((current) => adjacentWheelValue(days, current, direction));
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>, move: (direction: 1 | -1) => void) {
    if (Math.abs(event.deltaY) < 6) return;
    move(event.deltaY > 0 ? 1 : -1);
  }

  function handlePointerStart(event: React.PointerEvent<HTMLDivElement>, ref: React.MutableRefObject<number | null>) {
    ref.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>, ref: React.MutableRefObject<number | null>, move: (direction: 1 | -1) => void) {
    const startedAt = ref.current;
    ref.current = null;
    if (startedAt === null) return;
    const delta = event.clientY - startedAt;
    if (Math.abs(delta) < 20) return;
    move(delta < 0 ? 1 : -1);
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
        <img className="latest-picker-bg" src={`${A}birth-aura-panel-bg-v2-crop.png`} alt="" aria-hidden="true" />
        <img className="latest-picker-frame" src={`${A}birth-aura-wheel-frame-v2.png`} alt="" aria-hidden="true" />
        <div className="latest-picker-orb" aria-hidden="true" />
        <span className="latest-picker-star" aria-hidden="true">✦</span>
        <label className="latest-wheel-field">
          <b>Month</b>
          <select className="latest-select" aria-label="Month" value={month} onChange={(event) => setMonth(event.target.value)}>
            {months.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div
            className="latest-wheel-window"
            role="slider"
            aria-label="Month"
            aria-valuetext={month}
            tabIndex={0}
            onWheel={(event) => handleWheel(event, moveMonth)}
            onPointerDown={(event) => handlePointerStart(event, monthDragStart)}
            onPointerUp={(event) => handlePointerEnd(event, monthDragStart, moveMonth)}
            onPointerCancel={() => { monthDragStart.current = null; }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") moveMonth(1);
              if (event.key === "ArrowUp") moveMonth(-1);
            }}
          >
            {monthWheel.map(({ value, offset }) => (
              <button
                className={`${offset === 0 ? "selected" : ""} ${value.length >= 8 ? "long" : ""}`.trim()}
                data-offset={offset}
                key={`${value}-${offset}`}
                type="button"
                onClick={() => setMonth(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </label>
        <label className="latest-wheel-field">
          <b>Day</b>
          <select className="latest-select" aria-label="Day" value={day} onChange={(event) => setDay(event.target.value)}>
            {days.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <div
            className="latest-wheel-window"
            role="slider"
            aria-label="Day"
            aria-valuetext={day}
            tabIndex={0}
            onWheel={(event) => handleWheel(event, moveDay)}
            onPointerDown={(event) => handlePointerStart(event, dayDragStart)}
            onPointerUp={(event) => handlePointerEnd(event, dayDragStart, moveDay)}
            onPointerCancel={() => { dayDragStart.current = null; }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") moveDay(1);
              if (event.key === "ArrowUp") moveDay(-1);
            }}
          >
            {dayWheel.map(({ value, offset }) => (
              <button
                className={offset === 0 ? "selected" : ""}
                data-offset={offset}
                key={`${value}-${offset}`}
                type="button"
                onClick={() => setDay(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </label>
        <p className="latest-picker-note"><span aria-hidden="true">✦</span>We only need your month and day.</p>
        <p className="latest-picker-safe"><img src={`${A}privacy-lock-badge.png`} alt="" />Your birthday is private and never shared.<br />It&apos;s used only to personalize your readings.</p>
      </section>
      <p className="latest-preview-status" aria-live="polite">Preview: {preview.auraName} | {preview.zodiac} | {preview.element}</p>
      <Button href="/onboarding/birth-aura/reveal" onClick={submitBirthday} disabled={!canContinue}>Continue</Button>
    </Phone>
  );
}

export function LatestBirthRevealPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const revealTags = [
    { label: birthAura.zodiac, icon: "libra" },
    { label: birthAura.element, icon: "air" },
    { label: birthAura.stone, icon: "opal" }
  ];

  return (
    <Phone className="latest-birth-reveal">
      <Back href="/onboarding/birth-aura" tone="gold" />
      <span className="latest-reveal-moon" aria-hidden="true" />
      <span className="latest-reveal-star latest-reveal-star--left" aria-hidden="true" />
      <span className="latest-reveal-star latest-reveal-star--right" aria-hidden="true" />
      <Logo />
      <Divider />
      <section className="latest-title">
        <span>Your Birth Aura is</span>
        <h1>{birthAura.auraName}</h1>
      </section>
      <div className="latest-tags" aria-label="Birth aura traits">
        {revealTags.map((tag) => (
          <span key={tag.icon}>
            <i className={`latest-tag-icon latest-tag-icon--${tag.icon}`} aria-hidden="true" />
            {tag.label}
          </span>
        ))}
      </div>
      <article className="latest-quote">
        <Divider />
        <p>You carry luck through balance, beauty, and subtle attraction.</p>
      </article>
      <article className="latest-guardian">
        <figure className="latest-guardian-art" aria-hidden="true">
          <img src={`${A}birth-reveal-guardian-libra.png`} alt="" />
        </figure>
        <div>
          <small>Your First Guardian Color</small>
          <Divider />
          <h2>{birthAura.guardianColor}</h2>
          <p>{birthAura.styleMantra}</p>
        </div>
      </article>
      <Button href="/today/check-in">Begin Today&apos;s Ritual</Button>
      <p className="latest-note">You can edit this later in My Aura.</p>
    </Phone>
  );
}

export function LatestCheckInPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const [mood, setMood] = useState("Drained");
  const [scene, setScene] = useState("Work / Study");
  const canContinue = Boolean(mood && scene);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  function submitCheckIn() {
    writeJson(storageKeys.checkIn, { mood, scene });
    navigate("/today/draw");
  }

  return (
    <Phone className="latest-checkin">
      <Back />
      <Logo />
      <div className="latest-pill-row">
        <span><img src={`${A}calendar-star-chip-icon-tight.png`} alt="" />Jun 13 · Saturn</span>
        <span><img src={`${A}birth-aura-venus-symbol-tight.png`} alt="" />Birth Aura: {birthAura.auraName}</span>
      </div>
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState("");
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const checkIn = useStoredValue(storageKeys.checkIn, defaultCheckIn());

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [selectedCard]);

  async function reveal() {
    if (!selectedCard || isGenerating) return;

    setIsGenerating(true);
    setGenerationMessage("Reading your selected card...");
    writeJson(storageKeys.selectedCard, selectedCard);
    try {
      const oracle = await generateOracleFromApi(birthAura, checkIn, selectedCard);
      writeJson(storageKeys.oracle, oracle);
      navigate("/today/reading");
    } catch {
      const oracle = buildOracle(birthAura, checkIn, selectedCard);
      writeJson(storageKeys.oracle, oracle);
      setGenerationMessage("Network paused. A local reading is ready.");
      navigate("/today/reading");
    }
  }

  return (
    <Phone className={`latest-draw ${selectedCard ? "latest-draw--selected" : "latest-draw--choice"}`} nav="home">
      <Logo />
      <div className="latest-draw-pills" aria-label="Today and birth aura">
        <span className="latest-draw-pill latest-draw-pill--date"><img src={`${A}p0-05a-gold-star-icon.png`} alt="" />Jun 13 &middot; Saturn</span>
        <span className="latest-draw-pill latest-draw-pill--aura">
          <img src={`${A}p0-05a-venus-icon.png`} alt="" />Birth Aura &middot; {birthAura.auraName}
        </span>
      </div>

      {selectedCard ? (
        <>
          <div className="latest-draw-spread-pill">Daily One-Card Spread</div>
          <section className="latest-title latest-draw-title">
            <h1>Your card has<br />entered the spread.</h1>
            <p>This card will reveal today&apos;s core energy.</p>
          </section>
          <section className="latest-selected-card-stage" aria-label="Selected tarot card">
            <img className="latest-selected-card" src={`${A}${tarotBackAsset}`} alt="" />
          </section>
          <section className="latest-spread-panel" aria-label="Selected spread details">
            <div className="latest-spread-row latest-spread-row--header">
              <img src={`${A}p0-05b-panel-icon-spread-crop.png`} alt="" />
              <span>Daily One-Card Spread</span>
            </div>
            <div className="latest-spread-row">
              <img src={`${A}p0-05b-panel-icon-position-crop.png`} alt="" />
              <span>
                <small>Card Position</small>
                <strong>Today&apos;s Core Energy</strong>
              </span>
            </div>
            <div className="latest-spread-row">
              <img src={`${A}p0-05b-panel-icon-answer-crop.png`} alt="" />
              <span>
                <small>This card answers:</small>
                <em>What energy should I carry today?</em>
              </span>
            </div>
          </section>
          <p className="latest-note latest-draw-final-note">{generationMessage || "One card. One position. One message for today."}</p>
          <Divider className="latest-draw-bottom-divider" />
          <Button onClick={reveal} disabled={isGenerating}>{isGenerating ? "Reading..." : "Open My Reading"}</Button>
        </>
      ) : (
        <>
          <section className="latest-title latest-draw-title">
            <h1>Choose the card<br />that calls you.</h1>
            <p>Take one breath. Let today&apos;s aura find you.</p>
          </section>
          <section className="latest-card-stage" aria-label="Tarot card choices">
            {drawCards.map((label, index) => (
              <button
                aria-label={label}
                aria-pressed={selectedCard === label}
                className={`latest-tarot latest-tarot-${index}`}
                key={label}
                onClick={() => setSelectedCard(label)}
                type="button"
              >
                <img src={`${A}${tarotBackAsset}`} alt="" />
              </button>
            ))}
          </section>
          <p className="latest-note latest-draw-trust">Trust your first pull.</p>
          <Divider className="latest-draw-bottom-divider" />
        </>
      )}
    </Phone>
  );
}

export function LatestReadingPage() {
  const birthAura = useStoredValue(storageKeys.birthAura, defaultBirthAura());
  const checkIn = useStoredValue(storageKeys.checkIn, defaultCheckIn());
  const oracle = useStoredValue(storageKeys.oracle, defaultOracle());
  const [step, setStep] = useState(0);
  const steps = [
    {
      modifier: "begins",
      title: "Your reading begins.",
      subtitle: "Your card is now placed in today's core energy position.",
      cta: "Reveal the card's message"
    },
    {
      modifier: "clear",
      title: "Your message is clear.",
      subtitle: "Your card has revealed today's energy and how to carry it.",
      cta: "See My Style Oracle"
    },
    {
      modifier: "unfolds",
      title: "Your reading unfolds.",
      subtitle: "Each reveal shows why this card found you today.",
      cta: "Reveal today's shift"
    }
  ];
  const current = steps[step] ?? steps[0];

  useEffect(() => {
    ensureOracle();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  function advanceReading() {
    if (step >= 2) {
      navigate(`/result/${oracle.cardId || demoCardId}`);
      return;
    }
    setStep((value) => value + 1);
  }

  return (
    <Phone className={`latest-reading latest-reading--${current.modifier}`} nav="home">
      <Back href="/today/draw" />
      <Logo />
      <div className="latest-reading-pill">Daily One-Card Reading</div>
      <section className="latest-title">
        <h1>{current.title}</h1>
        <p>{current.subtitle}</p>
      </section>
      {step <= 2 ? (
        <div className="latest-reading-tags" aria-label="Reading structure">
          <span>Daily One-Card Spread</span>
          <span>Card Position</span>
          <span>Today's Core Energy</span>
        </div>
      ) : null}
      <section className="latest-reading-card" aria-label="Chosen tarot card">
        <img src={`${A}hero_woman_lion.png`} alt="" />
        <h2>Strength</h2>
        <Divider />
        <p>Soft Boundary</p>
      </section>
      {step === 0 ? (
        <article className="latest-reading-panel latest-reading-panel--intro">
          <small>Your Reading * 1 of 5</small>
          <h2>What you brought in</h2>
          <p>You arrived today carrying more than you wanted to show.</p>
          <p>Before the card speaks, it reflects how you arrived.</p>
          <div className="latest-reading-context"><span>Mood * {checkIn.mood}</span><span>Scene * {checkIn.scene}</span></div>
        </article>
      ) : null}
      {step === 1 ? (
        <section className="latest-reading-list" aria-label="Reading steps">
          {[
            ["1", "What you brought in", "You arrived today carrying more than you wanted to show."],
            ["2", "What the card reveals", "Strength appears when softness needs a clearer shape."],
            ["3", "Why this card found you", "Venus Air seeks harmony. Saturn brings structure and boundaries."],
            ["4", "What shifts now", `${checkIn.mood} -> Protected`]
          ].map(([number, title, text]) => (
            <article key={number}><b>{number}</b><div><h2>{title}</h2><p>{text}</p></div><i>✓</i></article>
          ))}
          <article className="latest-reading-style"><b>5</b><div><h2>Wear Today's Aura</h2><p>Lucky Color * Charcoal Navy</p><p>Guardian Item * Structured Jacket</p></div></article>
        </section>
      ) : null}
      {step === 2 ? (
        <section className="latest-reading-stack" aria-label="Expanded reading">
          <article><small>Your Reading * 1 of 5</small><h2>What you brought in</h2><p>You arrived today carrying more than you wanted to show.</p><div><span>Mood * {checkIn.mood}</span><span>Scene * {checkIn.scene}</span></div></article>
          <article><small>Your Reading * 2 of 5</small><h2>What the card reveals</h2><p>Strength appears when softness needs a clearer shape. This card is not asking you to become harder.</p></article>
          <article className="highlight"><small>Your Reading * 3 of 5</small><h2>Why this card found you</h2><p>Your Birth Aura, {birthAura.auraName}, seeks harmony and beauty. Today's ruling planet, Saturn, brings structure, boundaries, and stability.</p></article>
        </section>
      ) : null}
      <Button onClick={advanceReading}>{current.cta}</Button>
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
      <div className="latest-result-tags" aria-label="Reading structure">
        <span>Daily One-Card Spread</span>
        <span>Card Position</span>
        <span>Today's Core Energy</span>
      </div>
      <section className="latest-result-planet">
        <p>Today&apos;s Ruling Planet</p>
        <h1>Saturn</h1>
        <div className="latest-traits"><span>Structure</span><span>Boundaries</span><span>Stability</span></div>
      </section>
      <section className="latest-aura-summary"><div><p>Today&apos;s Aura</p><h2>{oracle.cardName}</h2><h3>{oracle.auraName}</h3></div><img src={`${A}shield-growth.png`} alt="" /></section>
      <section className="latest-why"><h3>* Why this card found you today</h3><p>{oracle.reason}</p><p className="latest-context-note">{birthAura.auraName} | {checkIn.mood} | {checkIn.scene}</p></section>
      <h2 className="latest-style-title">* Today&apos;s Style Cue *</h2>
      <div className="latest-style-list"><span>Lucky Color <b>{oracle.luckyColor}</b></span><span>Guardian Item <b>{oracle.guardianItem}</b></span><span>Style Formula <b>{oracle.styleFormula}</b></span></div>
      <Button href={`/activate/${oracle.cardId || demoCardId}`}>Seal Today&apos;s Aura</Button>
      <div className="latest-result-actions">
        <OutlineButton>Save Card</OutlineButton>
        <OutlineButton href={`/share/${oracle.cardId || demoCardId}`}>Share Story</OutlineButton>
      </div>
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
      navigate(`/activated/${sealedOracle.cardId || demoCardId}`);
    }, holdMs);
  }

  return (
    <Phone className="latest-activate">
      <Back href={`/result/${oracle.cardId || demoCardId}`} />
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
    navigate(`/saved/${savedOracle.cardId || demoCardId}`);
  }

  return (
    <Phone className="latest-activated">
      <Back href={`/activate/${oracle.cardId || demoCardId}`} tone="gold" />
      <Logo />
      <section className="latest-sealed-hero"><img src={`${A}hero-woman.png`} alt="" /><h2>* {oracle.auraName} *</h2></section>
      <section className="latest-title"><h1>* Aura Sealed *</h1><p>June 13 aura is active.</p><Divider /></section>
      <section className="latest-luck-shift" aria-label="Lucky shift">
        <small>Lucky Shift</small>
        <div><span>Drained</span><b>→</b><span>Protected</span></div>
      </section>
      <section className="latest-style-translation" aria-label="Style translation">
        <small>Style Translation</small>
        <span><b className="latest-swatch latest-swatch--navy" /><em>Lucky Color</em><strong>{oracle.luckyColor}</strong></span>
        <span><b className="latest-swatch latest-swatch--jacket" /><em>Guardian Item</em><strong>{oracle.guardianItem}</strong></span>
      </section>
      <Button href={`/share/${oracle.cardId || demoCardId}`}>Share Story</Button>
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
      <Back href={`/activated/${oracle.cardId || demoCardId}`} tone="gold" />
      <Logo />
      <section className="latest-title"><h1>Share Today&apos;s Aura</h1><p>Send your daily oracle as a beautiful story card.</p><Divider /></section>
      <article className="latest-story-card" aria-label="9:16 share preview">
        <img className="latest-story-card__background" src={`${A}hero-woman.png`} alt="" />
        <div className="latest-story-card__chips">
          <span>One-Card Spread</span>
          <span>Today&apos;s Core Energy</span>
        </div>
        <div className="latest-story-card__meta">
          <span><small>Ruling Planet</small><strong>Saturn</strong></span>
          <span><small>Birth Aura</small><strong>Venus Air</strong></span>
        </div>
        <div className="latest-story-card__card-name"><small>Card</small><strong>{oracle.cardName}</strong></div>
        <h2>{oracle.auraName}</h2>
        <p>* June 13 aura is active *</p>
        <div className="latest-story-card__shift"><small>Luck Shift</small><span>Drained <b>-&gt;</b> Protected</span></div>
        <div className="latest-story-card__details">
          <span><b className="latest-swatch latest-swatch--navy" />Lucky Color <strong>{oracle.luckyColor}</strong></span>
          <span><b className="latest-swatch latest-swatch--jacket" />Guardian Item <strong>{oracle.guardianItem}</strong></span>
        </div>
        <div className="latest-story-card__footer"><img src={`${A}lotus-logo.png`} alt="" /><span>AuraCue</span></div>
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
      <article className="latest-profile-card"><img src={`${A}moon_medallion.png`} alt="" /><div><span>Today *</span><h2>{oracle.auraName}</h2><p>{oracle.luckyColor} | {oracle.guardianItem}</p></div><a href={`/activated/${oracle.cardId || demoCardId}`} aria-label="Open today's sealed aura">&gt;</a></article>
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
