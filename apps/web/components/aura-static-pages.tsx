"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { WebShell } from "@/components/web-shell";
import { track } from "@/lib/analytics.js";

const birthdayStorageKey = "auracue:web:birthday:v1";
const birthdayMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function BirthdayPageFlow() {
  const router = useRouter();
  const [month, setMonth] = useState("Jun");
  const [day, setDay] = useState("13");

  useEffect(() => {
    const stored = window.localStorage.getItem(birthdayStorageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { month?: string; day?: string };
      if (parsed.month) setMonth(parsed.month);
      if (parsed.day) setDay(parsed.day);
    } catch {
      // Keep the default birth aura values.
    }
  }, []);

  function continueFlow() {
    window.localStorage.setItem(birthdayStorageKey, JSON.stringify({ month, day }));
    void track("birthday_submitted", { month, day });
    router.push("/birth-aura");
  }

  return (
    <WebShell title="Enter your birthday" eyebrow="Step 2 · Birth Aura" referenceId="context">
      <div className="auracue-flow auracue-flow--birthday">
        <div className="auracue-activated-star" aria-hidden="true">
          <Image src="/aura-assets/common-brand-lotus.png" alt="" width={70} height={70} />
        </div>
        <p className="auracue-flow__lead">Your birthday tunes the reading to your natural aura. No account needed.</p>
        <div className="auracue-result-card__details">
          <div>
            <dt>Month</dt>
            <dd>
              <select value={month} onChange={(event) => setMonth(event.target.value)}>
                {birthdayMonths.map((item) => <option key={item}>{item}</option>)}
              </select>
            </dd>
          </div>
          <div>
            <dt>Day</dt>
            <dd>
              <input inputMode="numeric" maxLength={2} value={day} onChange={(event) => setDay(event.target.value.replace(/\D/g, "").slice(0, 2))} />
            </dd>
          </div>
        </div>
        <button className="auracue-primary-action" type="button" onClick={continueFlow}>Reveal Birth Aura</button>
        <button className="auracue-context-skip" type="button" onClick={() => router.push("/create/upload")}>Skip for today</button>
      </div>
    </WebShell>
  );
}

export function BirthAuraPageFlow() {
  const router = useRouter();
  return (
    <WebShell title="Your Birth Aura" eyebrow="Personal aura signature" referenceId="result">
      <div className="auracue-flow auracue-flow--birth-aura">
        <article className="auracue-result-card">
          <div className="auracue-result-card__hero">
            <div className="auracue-result-card__hero-copy">
              <h2>Golden Bloom</h2>
              <p>Warm intuition, soft confidence, and a natural pull toward beauty.</p>
              <em>Lucky Color: Blush Pink</em>
            </div>
            <Image className="auracue-result-card__hero-person" src="/aura-assets/mood-confident-woman-art.png" alt="" width={240} height={180} />
            <Image className="auracue-result-card__hero-rose" src="/aura-assets/mood-romantic-rose-art.png" alt="" width={200} height={160} />
          </div>
          <dl className="auracue-result-card__details">
            <div><dt>Guardian Item</dt><dd>Jewelry</dd></div>
            <div><dt>Energy</dt><dd>Radiant and softly magnetic</dd></div>
            <div><dt>Style cue</dt><dd>Carry one warm gold or blush detail today.</dd></div>
          </dl>
        </article>
        <button className="auracue-primary-action" type="button" onClick={() => router.push("/create/upload")}>Continue to Today&apos;s Oracle</button>
      </div>
    </WebShell>
  );
}

export function ReadingAuraPageFlow() {
  return (
    <WebShell title="Reading your aura" eyebrow="Preparing oracle" referenceId="reveal">
      <div className="auracue-flow auracue-flow--reading">
        <div className="auracue-activated-star" aria-hidden="true">
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={42} height={42} />
        </div>
        <LoadingState title="Preparing oracle" message="Reading your mood, scene, card, and today&apos;s style energy." />
        <p className="auracue-flow__safe">This usually takes a few seconds.</p>
      </div>
    </WebShell>
  );
}
