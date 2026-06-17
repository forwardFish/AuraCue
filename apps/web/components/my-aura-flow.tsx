"use client";

import Link from "next/link";
import Image from "next/image";
import { WebShell } from "@/components/web-shell";

const savedCards = [
  { id: "demo-soft-boundary", title: "Soft Boundary", color: "Blush Pink", tone: "Calm confidence", asset: "/aura-assets/mood-confident-woman-art.png" },
  { id: "demo-golden-bloom", title: "Golden Bloom", color: "Soft Gold", tone: "Radiant ease", asset: "/aura-assets/mood-romantic-rose-art.png" },
  { id: "demo-lunar-linen", title: "Lunar Linen", color: "Deep Navy", tone: "Quiet focus", asset: "/aura-assets/mood-calm-lotus-stones-art.png" }
];

export function MyAuraPageFlow() {
  return (
    <WebShell title="My Aura" eyebrow="Saved rituals" referenceId="saved">
      <div className="auracue-flow auracue-flow--my">
        <section className="auracue-active-entry">
          <span>Current aura</span>
          <strong>Golden Bloom</strong>
        </section>
        <div className="auracue-result-card__details">
          <div><dt>Cards</dt><dd>7 saved</dd></div>
          <div><dt>Sealed</dt><dd>3 activated</dd></div>
          <div><dt>Shares</dt><dd>12 stories</dd></div>
        </div>
        <div className="auracue-mood-stack" aria-label="Saved aura cards">
          {savedCards.map((card) => (
            <Link className="auracue-mood-card" key={card.id} href={`/share/${card.id}`}>
              <span className="auracue-mood-card__copy">
                <strong>{card.title}</strong>
                <span>{card.tone}</span>
                <em>Lucky color · {card.color}</em>
              </span>
              <Image className="auracue-mood-card__art" src={card.asset} alt="" width={160} height={120} />
            </Link>
          ))}
        </div>
      </div>
    </WebShell>
  );
}
