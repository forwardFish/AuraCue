import { createContext, type ComponentType, type CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { art, icons } from './assets';

type RouteKey =
  | '/home'
  | '/onboarding/birth-aura'
  | '/onboarding/birth-aura/reveal'
  | '/today/check-in'
  | '/today/draw'
  | '/today/reading'
  | '/result/today'
  | '/activate/today'
  | '/activated/today'
  | '/share/today'
  | '/saved/today'
  | '/my'
  | '/my/birth-aura'
  | '/legal/privacy'
  | '/legal/terms'
  | '/404';

type RouteConfig = {
  path: RouteKey;
  label: string;
  Component: ComponentType;
};

type Choice = {
  label: string;
  icon: string;
  selected?: boolean;
  wide?: boolean;
};

type AppState = {
  birthAuraCreated: boolean;
  checkInComplete: boolean;
  cardDrawn: boolean;
  readingComplete: boolean;
  auraSealed: boolean;
  cardSaved: boolean;
  shared: boolean;
  linkCopied: boolean;
};

type AppContextValue = {
  state: AppState;
  patchState: (patch: Partial<AppState>) => void;
  go: (path: RouteKey, patch?: Partial<AppState>) => void;
};

const storageKey = 'auracue:v41:flow-state';
const defaultState: AppState = {
  birthAuraCreated: false,
  checkInComplete: false,
  cardDrawn: false,
  readingComplete: false,
  auraSealed: false,
  cardSaved: false,
  shared: false,
  linkCopied: false
};

const AppContext = createContext<AppContextValue | null>(null);

const routes: RouteConfig[] = [
  { path: '/home', label: 'Home', Component: HomePage },
  { path: '/onboarding/birth-aura', label: 'Birth Aura', Component: BirthAuraCreatePage },
  { path: '/onboarding/birth-aura/reveal', label: 'Birth Reveal', Component: BirthAuraRevealPage },
  { path: '/today/check-in', label: 'Check-in', Component: CheckInPage },
  { path: '/today/draw', label: 'Draw', Component: DrawPage },
  { path: '/today/reading', label: 'Reading', Component: ReadingPage },
  { path: '/result/today', label: 'Result', Component: ResultPage },
  { path: '/activate/today', label: 'Activate', Component: ActivatePage },
  { path: '/activated/today', label: 'Activated', Component: ActivatedPage },
  { path: '/share/today', label: 'Share', Component: SharePage },
  { path: '/saved/today', label: 'Saved', Component: SavedPage },
  { path: '/my', label: 'My', Component: MyPage },
  { path: '/my/birth-aura', label: 'Birth Profile', Component: BirthAuraProfilePage },
  { path: '/legal/privacy', label: 'Privacy', Component: PrivacyPage },
  { path: '/legal/terms', label: 'Terms', Component: TermsPage },
  { path: '/404', label: '404', Component: NotFoundPage }
];

function routeTo(path: RouteKey) {
  window.location.hash = path;
}

function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(next: AppState) {
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

function guardRoute(route: RouteKey, state: AppState): RouteKey {
  if (route === '/404' || route.startsWith('/legal') || route === '/home' || route === '/my') return route;
  if (route === '/onboarding/birth-aura') return route;
  if (route === '/onboarding/birth-aura/reveal') return state.birthAuraCreated ? route : '/onboarding/birth-aura';
  if (route === '/my/birth-aura') return state.birthAuraCreated ? route : '/onboarding/birth-aura';
  if (route === '/today/check-in') return state.birthAuraCreated ? route : '/onboarding/birth-aura';
  if (route === '/today/draw') return state.checkInComplete ? route : state.birthAuraCreated ? '/today/check-in' : '/onboarding/birth-aura';
  if (route === '/today/reading') return state.cardDrawn ? route : state.checkInComplete ? '/today/draw' : '/today/check-in';
  if (route === '/result/today') return state.readingComplete || state.auraSealed || state.cardSaved ? route : state.cardDrawn ? '/today/reading' : '/today/draw';
  if (route === '/activate/today') return state.readingComplete || state.auraSealed ? route : '/result/today';
  if (route === '/activated/today') return state.auraSealed ? route : '/activate/today';
  if (route === '/share/today' || route === '/saved/today') return state.readingComplete || state.auraSealed || state.cardSaved ? route : '/result/today';
  return route;
}

function useAuraCue() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AuraCue context is missing');
  }
  return context;
}

function normalizeRoute(): RouteKey {
  const raw = window.location.hash.replace(/^#/, '') || '/home';
  if (raw === '/' || raw === '') return '/home';
  if (raw.startsWith('/result/')) return '/result/today';
  if (raw.startsWith('/activate/')) return '/activate/today';
  if (raw.startsWith('/activated/')) return '/activated/today';
  if (raw.startsWith('/share/')) return '/share/today';
  if (raw.startsWith('/saved/')) return '/saved/today';
  return routes.some((route) => route.path === raw) ? (raw as RouteKey) : '/404';
}

export function App() {
  const [route, setRoute] = useState<RouteKey>(() => normalizeRoute());
  const [state, setState] = useState<AppState>(() => loadState());

  const patchState = (patch: Partial<AppState>) => {
    setState((current) => {
      const next = { ...current, ...patch };
      saveState(next);
      return next;
    });
  };

  const go = (path: RouteKey, patch?: Partial<AppState>) => {
    const nextState = patch ? { ...state, ...patch } : state;
    if (patch) {
      saveState(nextState);
      setState(nextState);
    }
    routeTo(guardRoute(path, nextState));
  };

  useEffect(() => {
    if (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#') {
      routeTo('/home');
    }
    const onHash = () => {
      if (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#') {
        routeTo('/home');
        return;
      }
      setRoute(normalizeRoute());
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const guarded = guardRoute(route, state);
    if (guarded !== route) {
      routeTo(guarded);
    }
  }, [route, state]);

  const effectiveRoute = guardRoute(route, state);
  const current = useMemo(() => routes.find((item) => item.path === effectiveRoute) ?? routes[routes.length - 1], [effectiveRoute]);
  const Current = current.Component;
  const appValue = useMemo(() => ({ state, patchState, go }), [state]);

  return (
    <AppContext.Provider value={appValue}>
      <Current />
      <nav className="route-dock" aria-label="v4.1 route switcher">
        {routes.map((item) => (
          <a key={item.path} className={item.path === effectiveRoute ? 'active' : ''} href={`#${item.path}`}>
            {item.label}
          </a>
        ))}
      </nav>
    </AppContext.Provider>
  );
}

function Chrome({
  children,
  className = '',
  close = false,
  gift = false,
  profile = false,
  nav = true
}: {
  children: React.ReactNode;
  className?: string;
  close?: boolean;
  gift?: boolean;
  profile?: boolean;
  nav?: boolean;
}) {
  return (
    <main className={`screen ${className}`}>
      <StatusBar />
      <button className={`chrome-button chrome-left ${profile ? 'profile-button' : ''}`} onClick={() => routeTo(close ? '/home' : '/home')} aria-label={close ? 'Close' : 'Back'}>
        <img src={profile ? icons.avatar : close ? icons.close : icons.back} alt="" />
      </button>
      {gift && (
        <button className="chrome-button chrome-right" aria-label="Gift">
          <img src={icons.gift} alt="" />
        </button>
      )}
      <Logo />
      {children}
      {nav && <BottomNav />}
      <div className="home-indicator" />
    </main>
  );
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <div className="status-icons">
        <i className="signal" />
        <i className="wifi" />
        <i className="battery" />
      </div>
    </div>
  );
}

function Logo({ subtitle = false }: { subtitle?: boolean }) {
  return (
    <header className="logo">
      <img src={icons.lotus} alt="AuraCue" />
      <b>AuraCue</b>
      {subtitle && <p>Your Daily Tarot Style Oracle</p>}
    </header>
  );
}

function GradientButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button className={`gradient-button ${className}`} onClick={onClick}>
      <span>+</span>
      {children}
      <span>+</span>
    </button>
  );
}

function SoftButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button className={`soft-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

function BottomNav({ active = 'home' }: { active?: 'home' | 'my' }) {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <button className={active === 'home' ? 'active' : ''} onClick={() => routeTo('/home')}>
        <span className="nav-icon nav-home" aria-hidden="true" />
        Home
      </button>
      <i />
      <button className={active === 'my' ? 'active' : ''} onClick={() => routeTo('/my')}>
        <span className="nav-icon nav-user" aria-hidden="true" />
        My
      </button>
    </nav>
  );
}

function RulingPlanetCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`ruling-card ${compact ? 'compact' : ''}`}>
      <small>Jun 13 · Saturday</small>
      <p>Today&apos;s Ruling Planet</p>
      <h2>Saturn</h2>
      <div className="keyword-row">
        <span>Structure</span>
        <span>Boundaries</span>
        <span>Stability</span>
      </div>
    </article>
  );
}

function BirthAuraChip() {
  return (
    <div className="birth-chip">
      <img src={icons.venus} alt="" />
      Birth Aura: <b>Venus Air</b>
    </div>
  );
}

function ChoiceGrid({ items, columns = 2 }: { items: Choice[]; columns?: 2 | 3 }) {
  return (
    <div className={`choice-grid cols-${columns}`}>
      {items.map((item) => (
        <button key={item.label} className={`choice ${item.selected ? 'selected' : ''} ${item.wide ? 'wide' : ''}`}>
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
          {item.selected && <img className="choice-check" src={icons.check} alt="" />}
        </button>
      ))}
    </div>
  );
}

function HomePage() {
  const { state, go } = useAuraCue();
  const cta = !state.birthAuraCreated
    ? { label: 'Start My First Aura', path: '/onboarding/birth-aura' as RouteKey }
    : state.auraSealed
      ? { label: 'View Today\'s Aura', path: '/result/today' as RouteKey }
      : state.readingComplete
        ? { label: 'Seal Today\'s Aura', path: '/activate/today' as RouteKey }
        : { label: 'Begin Today\'s Ritual', path: '/today/check-in' as RouteKey };

  return (
    <Chrome className="v41-home" profile gift>
      <section className="hero-title v41-home-title">
        <h1>{state.birthAuraCreated ? <>Today&apos;s Aura<br />Is Open</> : <>Start Your<br />Aura Journey</>}</h1>
        <p>{state.auraSealed ? 'Your sealed card is ready in My Aura.' : 'Draw one card, activate today\'s aura, and wear your luck.'}</p>
      </section>
      <RulingPlanetCard />
      <section className="home-oracle-preview">
        {state.birthAuraCreated ? <BirthAuraChip /> : <span className="birth-chip">Birth Aura waiting to be revealed</span>}
        <img src={art.tarotBack} alt="" />
        <p>{state.auraSealed ? 'Soft Boundary is sealed for today.' : 'A new ruling planet opens today\'s aura.'}</p>
      </section>
      <GradientButton onClick={() => go(cta.path)}>{cta.label}</GradientButton>
    </Chrome>
  );
}

function BirthAuraCreatePage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="birth-create-screen" nav={false}>
      <section className="hero-title compact">
        <h1>Create Your<br />Birth Aura</h1>
        <p>Your birthday becomes the key to how each card speaks to you.</p>
      </section>
      <section className="birth-picker-card v41-birth-picker">
        <img src={art.venusOrb} alt="" />
        <div className="birth-picker-grid">
          <label>Month <b>10</b></label>
          <label>Day <b>07</b></label>
        </div>
      </section>
      <GradientButton onClick={() => go('/onboarding/birth-aura/reveal', { birthAuraCreated: true })}>Reveal My Birth Aura</GradientButton>
      <button className="skip-link" onClick={() => routeTo('/home')}>Maybe later</button>
    </Chrome>
  );
}

function BirthAuraRevealPage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="birth-reveal-screen" nav={false}>
      <section className="birth-result-title">
        <span>Your Birth Aura is</span>
        <h1>Venus Air</h1>
      </section>
      <div className="birth-tags">
        <span>Libra</span>
        <span>Air</span>
        <span>Opal</span>
      </div>
      <section className="guardian-color-card v41-guardian">
        <img src={art.venusOrb} alt="" />
        <div>
          <small>Your First Guardian Color</small>
          <h2>Soft Opal Pink</h2>
          <p>You carry luck through balance, beauty, and subtle attraction.</p>
        </div>
      </section>
      <GradientButton onClick={() => go('/today/check-in')}>Begin Today&apos;s Ritual</GradientButton>
    </Chrome>
  );
}

function CheckInPage() {
  const { go } = useAuraCue();
  const moods: Choice[] = [
    { label: 'Drained', icon: icons.drop, selected: true },
    { label: 'Soft', icon: icons.cloud },
    { label: 'Restless', icon: icons.refresh },
    { label: 'Hidden', icon: icons.eye },
    { label: 'Focused', icon: icons.sparklePurple },
    { label: 'Magnetic', icon: icons.sparkleGold },
    { label: 'Unbothered', icon: icons.lotus, wide: true },
    { label: 'Main Character', icon: icons.gift, wide: true }
  ];
  const scenes: Choice[] = [
    { label: 'Work / Study', icon: icons.book, selected: true },
    { label: 'Important Moment', icon: icons.sparkleGold },
    { label: 'Stay Low-Key', icon: icons.lock },
    { label: 'Just Survive Today', icon: icons.flower },
    { label: 'Need Protection', icon: icons.shield },
    { label: 'Want to Be Seen', icon: icons.eye },
    { label: 'Social', icon: icons.people },
    { label: 'Soft Reset', icon: icons.refresh }
  ];

  return (
    <Chrome className="checkin-screen">
      <div className="top-pill-row v41-pills">
        <BirthAuraChip />
      </div>
      <RulingPlanetCard compact />
      <section className="mood-panel card-frame v41-checkin-panel">
        <h1>How are you arriving today?</h1>
        <ChoiceGrid items={moods} columns={2} />
        <h2>What is today asking from you?</h2>
        <ChoiceGrid items={scenes} columns={2} />
      </section>
      <GradientButton onClick={() => go('/today/draw', { checkInComplete: true })}>Continue to Your Card</GradientButton>
    </Chrome>
  );
}

function DrawPage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="draw-screen" gift>
      <section className="hero-title draw-title">
        <h1>Choose the card<br />that calls you.</h1>
        <p>Take a breath. Today&apos;s card will translate your energy into style.</p>
      </section>
      <section className="tarot-stage">
        {['Card I', 'Card II', 'Card III'].map((label, index) => (
          <button key={label} className={`tarot tarot-${index + 1}`} onClick={() => go('/today/reading', { cardDrawn: true })}>
            <img src={art.tarotBack} alt="" />
            <span>{label}</span>
          </button>
        ))}
      </section>
      <p className="hint-line">Trust your first pull.</p>
      <GradientButton onClick={() => go('/today/reading', { cardDrawn: true })}>Choose the Card</GradientButton>
    </Chrome>
  );
}

function ReadingPage() {
  const { go } = useAuraCue();

  useEffect(() => {
    const timer = window.setTimeout(() => go('/result/today', { readingComplete: true }), 1400);
    return () => window.clearTimeout(timer);
  }, [go]);

  return (
    <Chrome className="reading-screen">
      <section className="reading-oracle-card">
        <img src={art.tarotBack} alt="" />
        <h1>Strength</h1>
        <h2>Soft Boundary</h2>
      </section>
      <div className="loading-steps v41-reading-steps">
        <Progress label="Reading your Birth Aura..." value={46} />
        <Progress label="Aligning with today&apos;s ruling planet..." value={62} />
        <Progress label="Listening to your card..." value={78} />
        <Progress label="Translating energy into style..." value={90} />
      </div>
    </Chrome>
  );
}

function ResultPage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="result-screen v41-result" gift>
      <section className="result-title">
        <h1>Jun 13 Style Oracle</h1>
      </section>
      <RulingPlanetCard compact />
      <div className="result-chip-row">
        <BirthAuraChip />
        <span className="birth-chip"><img src={icons.shield} alt="" />Card: <b>Strength</b></span>
      </div>
      <article className="aura-main-card">
        <img src={art.hero} alt="" />
        <div>
          <small>Strength</small>
          <h2>Soft Boundary</h2>
          <p>Luck Shift</p>
          <b>Drained → Protected</b>
        </div>
      </article>
      <section className="why-card">
        <h3>Why this card found you today</h3>
        <p>You arrived today feeling drained. Because your Birth Aura carries Venus Air, you may give too much energy to keep things beautiful. Today is ruled by Saturn, bringing structure, boundaries, and stability. Strength asks you to protect your softness with clearer shape.</p>
      </section>
      <section className="style-cue">
        <h2>Today&apos;s Style Cue</h2>
        <InfoPanel title="Lucky Color" icon={icons.swatch}>Charcoal Navy</InfoPanel>
        <InfoPanel title="Guardian Item" icon={icons.dress}>Structured Jacket</InfoPanel>
        <InfoPanel title="Style Formula" icon={icons.sparkleGold}>Soft layer + clean outer shape + silver detail</InfoPanel>
      </section>
      <GradientButton onClick={() => go('/activate/today')}>Seal Today&apos;s Aura</GradientButton>
      <div className="two-actions">
        <SoftButton onClick={() => go('/saved/today', { cardSaved: true })}>Save Card</SoftButton>
        <SoftButton onClick={() => go('/share/today')}>Share Story</SoftButton>
      </div>
    </Chrome>
  );
}

function ActivatePage() {
  const { go } = useAuraCue();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<number | null>(null);
  const startedAt = useRef(0);

  const cancelHold = () => {
    if (holdTimer.current) {
      window.clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHoldProgress(0);
  };

  const startHold = () => {
    cancelHold();
    startedAt.current = Date.now();
    holdTimer.current = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - startedAt.current) / 1800) * 100));
      setHoldProgress(next);
      if (next >= 100) {
        cancelHold();
        go('/activated/today', { auraSealed: true, cardSaved: true });
      }
    }, 40);
  };

  return (
    <Chrome className="activate-screen" nav={false}>
      <section className="hero-title compact">
        <h1>Your Guardian<br />Item Today</h1>
        <p>Structured Jacket</p>
      </section>
      <section className="guardian-seal-card">
        <img src={icons.dress} alt="" />
        <h2>It is not here to make you harder.</h2>
        <p>It helps you protect your softness.</p>
        <div className="lucky-color-pill">Lucky Color · Charcoal Navy</div>
      </section>
      <section className="hold-seal">
        <h2>Hold to Seal</h2>
        <p>Place one finger here. Hold to seal today&apos;s aura.</p>
        <button
          className={holdProgress > 0 ? 'holding' : ''}
          style={{ '--hold-progress': `${holdProgress}%` } as CSSProperties}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
        >
          <img src={art.lotusPink} alt="" />
          {holdProgress >= 100 ? 'Sealed' : holdProgress > 0 ? `${holdProgress}%` : 'Hold to Seal'}
        </button>
      </section>
    </Chrome>
  );
}

function ActivatedPage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="activated-screen" profile gift>
      <section className="sunburst">+</section>
      <section className="hero-title activated-title">
        <h1>Aura Sealed</h1>
        <p>June 13 aura is active.</p>
      </section>
      <article className="activated-card">
        <h2>Soft Boundary</h2>
        <p>is with you today.</p>
        <p>Lucky Color: Charcoal Navy</p>
        <p>Guardian Item: Structured Jacket</p>
      </article>
      <div className="button-stack v41-activated-actions">
        <GradientButton onClick={() => go('/share/today')}>Share Story</GradientButton>
        <SoftButton onClick={() => go('/saved/today', { cardSaved: true })}>Save Card</SoftButton>
        <SoftButton onClick={() => go('/my')}>Done</SoftButton>
      </div>
    </Chrome>
  );
}

function SharePage() {
  const { go, patchState, state } = useAuraCue();

  return (
    <Chrome className="share-screen" close nav={false}>
      <section className="hero-title compact">
        <h1>Share Today&apos;s Aura</h1>
      </section>
      <ShareCard />
      <div className="button-stack share-actions">
        <GradientButton onClick={() => go('/my', { shared: true })}>Share Story</GradientButton>
        <SoftButton onClick={() => go('/saved/today', { cardSaved: true })}>Download Image</SoftButton>
        <SoftButton onClick={() => patchState({ linkCopied: true })}>{state.linkCopied ? 'Link Copied' : 'Copy Link'}</SoftButton>
      </div>
    </Chrome>
  );
}

function SavedPage() {
  const { go } = useAuraCue();

  return (
    <Chrome className="saved-screen" close nav={false}>
      <section className="check-orb">
        <img src={icons.check} alt="" />
      </section>
      <section className="hero-title compact">
        <h1>Saved to<br />My Aura Cards</h1>
        <p>Your June 13 aura is ready whenever you need it.</p>
      </section>
      <ShareCard compact />
      <div className="button-stack saved-actions">
        <GradientButton onClick={() => go('/my')}>View in My</GradientButton>
        <SoftButton onClick={() => go('/share/today')}>Share Story</SoftButton>
        <SoftButton onClick={() => go('/home')}>Back Home</SoftButton>
      </div>
    </Chrome>
  );
}

function MyPage() {
  const { state, go } = useAuraCue();

  return (
    <Chrome className="my-screen" profile gift nav={false}>
      <section className="hero-title compact">
        <h1>My Aura</h1>
        <p>{state.birthAuraCreated ? 'Your aura is becoming a trail.' : 'Create your Birth Aura to begin your trail.'}</p>
      </section>
      {state.birthAuraCreated ? (
        <section className="my-card">
          <img src={art.venusOrb} alt="" />
          <div>
            <small>Birth Aura</small>
            <h2>Venus Air</h2>
            <p>Libra - Air - Opal</p>
            <button onClick={() => go('/my/birth-aura')}>View / Edit Birth Aura</button>
          </div>
        </section>
      ) : (
        <section className="my-card empty">
          <img src={art.venusOrb} alt="" />
          <div>
            <small>Birth Aura</small>
            <h2>Not created yet</h2>
            <p>Your month and day unlock personalized readings.</p>
            <button onClick={() => go('/onboarding/birth-aura')}>Create Birth Aura</button>
          </div>
        </section>
      )}
      {state.auraSealed || state.cardSaved ? (
        <>
          <section className="my-card">
            <img src={art.tarotBack} alt="" />
            <div>
              <small>Today&apos;s Sealed Aura</small>
              <h2>Soft Boundary</h2>
              <p>Charcoal Navy - Structured Jacket</p>
              <button onClick={() => go('/result/today')}>View Today&apos;s Card</button>
            </div>
          </section>
          <section className="history-panel">
            <h2>Aura History</h2>
            <p>Jun 13 - Soft Boundary - Sealed</p>
            <p>Jun 12 - Clean Renewal - Sealed</p>
            <p>Jun 11 - Quiet Power</p>
          </section>
        </>
      ) : (
        <section className="history-panel empty">
          <h2>Aura History</h2>
          <p>No sealed cards yet. Finish today&apos;s ritual to save your first aura.</p>
          <button onClick={() => go(state.birthAuraCreated ? '/today/check-in' : '/onboarding/birth-aura')}>Start Ritual</button>
        </section>
      )}
      <section className="legal-row">
        <button onClick={() => routeTo('/legal/privacy')}>Privacy</button>
        <button onClick={() => routeTo('/legal/terms')}>Terms</button>
      </section>
      <BottomNav active="my" />
    </Chrome>
  );
}

function BirthAuraProfilePage() {
  return (
    <Chrome className="birth-profile-screen" nav={false}>
      <section className="hero-title compact">
        <h1>Birth Aura</h1>
      </section>
      <section className="guardian-color-card v41-guardian">
        <img src={art.venusOrb} alt="" />
        <div>
          <h2>Venus Air</h2>
          <p>Libra · Air · Opal</p>
          <small>Guardian Color</small>
          <p>Soft Opal Pink</p>
          <small>Style Mantra</small>
          <p>I attract through balance, not effort.</p>
          <small>Birthday</small>
          <p>Oct 07</p>
        </div>
      </section>
      <SoftButton>Edit Birthday</SoftButton>
      <p className="privacy-note">Changing your birthday will update future readings. Past sealed cards will stay unchanged.</p>
    </Chrome>
  );
}

function PrivacyPage() {
  return (
    <Chrome className="legal-screen" nav={false}>
      <section className="hero-title compact">
        <h1>Privacy</h1>
        <p>AuraCue uses anonymous identity in P0 and only asks for month and day.</p>
      </section>
      <section className="legal-copy">
        <p>We do not sell user data. Share cards are only shared when you choose to share them.</p>
        <p>AuraCue offers self-reflection and style inspiration, not medical, psychological, or fate guarantees.</p>
      </section>
    </Chrome>
  );
}

function TermsPage() {
  return (
    <Chrome className="legal-screen" nav={false}>
      <section className="hero-title compact">
        <h1>Terms</h1>
        <p>AuraCue gives symbolic style cues, not guaranteed outcomes.</p>
      </section>
      <section className="legal-copy">
        <p>You keep your own choices. The product does not promise luck, love, success, beauty, or health results.</p>
      </section>
    </Chrome>
  );
}

function NotFoundPage() {
  return (
    <Chrome className="error-screen" close nav={false}>
      <section className="error-art">
        <img src={art.tarotTilt} alt="" />
        <b>!</b>
      </section>
      <section className="hero-title error-title">
        <h1>Your aura slipped<br />away for a second.</h1>
        <p>Let&apos;s reconnect and try again.</p>
      </section>
      <GradientButton onClick={() => routeTo('/home')}>Try Again</GradientButton>
    </Chrome>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-row">
      <span>{label}</span>
      <i>
        <b style={{ width: `${value}%` }} />
      </i>
    </div>
  );
}

function InfoPanel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <article className="info-panel">
      <h3>
        <img src={icon} alt="" />
        {title}
      </h3>
      <p>{children}</p>
    </article>
  );
}

function ShareCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className={`share-card ${compact ? 'compact' : ''}`}>
      <header>
        <img src={icons.lotus} alt="" />
        <span>AuraCue</span>
      </header>
      <img className="share-portrait" src={art.hero} alt="" />
      <h2>Soft Boundary</h2>
      <p>Today&apos;s Aura · Jun 13, 2026</p>
      <div className="share-facts">
        <span>Ruling Planet<br /><b>Saturn</b></span>
        <span>Birth Aura<br /><b>Venus Air</b></span>
        <span>Luck Shift<br /><b>Drained → Protected</b></span>
        <span>Guardian Item<br /><b>Structured Jacket</b></span>
      </div>
      <footer>Sealed by AuraCue · Draw yours on AuraCue</footer>
    </article>
  );
}
