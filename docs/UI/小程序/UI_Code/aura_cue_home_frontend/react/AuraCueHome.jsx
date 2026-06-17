import './AuraCueHome.css';

const A = '/assets/';

export default function AuraCueHome() {
  return (
    <main className="phone" aria-label="AuraCue home screen">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="statusbar">
        <div className="status-time">9:41</div>
        <div className="status-icons" aria-hidden="true">
          <div className="signal"><span /><span /><span /><span /></div>
          <div className="wifi"><span /></div>
          <div className="battery"><span /></div>
        </div>
      </div>

      <section className="brand-block">
        <img className="brand-lotus" src={`${A}lotus-logo.png`} alt="AuraCue lotus logo" />
        <h1>AuraCue</h1>
        <p>Your Daily Tarot Style Oracle</p>
      </section>

      <button className="date-chip" type="button">
        <img src={`${A}calendar-star.png`} alt="" />
        <span>Jun 13 · Saturday</span>
      </button>

      <section className="planet-card">
        <div className="sparkle-field" aria-hidden="true">
          <i className="s1" /><i className="s2" /><i className="s3" /><i className="s4" /><i className="s5" /><i className="s6" />
        </div>

        <img className="hero-woman" src={`${A}hero-woman.png`} alt="Soft aura portrait" />

        <div className="planet-copy">
          <div className="planet-kicker">Today’s Ruling Planet</div>
          <div className="gold-rule top-rule"><span /><b>✧</b><span /></div>
          <div className="planet-name">Saturn</div>
          <div className="gold-rule bottom-rule"><small /><span /><b>✦</b><span /><small /></div>
        </div>

        <div className="trait-row">
          <button className="trait-pill" type="button">
            <img src={`${A}shield.png`} alt="" />
            <span>Structure</span>
          </button>
          <button className="trait-pill" type="button">
            <img src={`${A}lock.png`} alt="" />
            <span>Boundaries</span>
          </button>
          <button className="trait-pill" type="button">
            <img src={`${A}scales.png`} alt="" />
            <span>Stability</span>
          </button>
        </div>
      </section>

      <button className="primary-cta" type="button">
        <span>✦</span>
        <strong>Start My First Aura</strong>
        <span>✦</span>
      </button>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        <button className="nav-item active" type="button" aria-current="page">
          <img src={`${A}home.png`} alt="" />
          <span>Home</span>
        </button>
        <div className="nav-divider" aria-hidden="true" />
        <button className="nav-item" type="button">
          <img src={`${A}user.png`} alt="" />
          <span>My</span>
        </button>
      </nav>

      <div className="home-indicator" aria-hidden="true" />
    </main>
  );
}
