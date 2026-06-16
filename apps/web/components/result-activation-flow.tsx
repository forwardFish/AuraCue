"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { WebShell } from "@/components/web-shell";
import { apiClient, AuraCueApiError } from "@/lib/api-client.js";
import { track } from "@/lib/analytics.js";

const platform = "web";
const anonymousStorageKey = "auracue:web:anonymous-id:v1";
export const holdToSealDurationMs = 3000;

type CardContent = {
  title?: string;
  auraName?: string;
  tarotSymbol?: string;
  luckyColor?: string;
  styleVibe?: string;
  energyMessage?: string;
  outfitEnergy?: string;
  beautyCue?: string;
  socialMove?: string;
  miniRitual?: string;
  todayIntention?: string;
  shareCaption?: string;
  safetyDisclaimer?: string;
  luckyAnchorCandidates?: Array<{ type?: string; label?: string }>;
};

type AuraCard = {
  cardId: string;
  mood?: string | null;
  context?: string | null;
  drawPosition?: number | null;
  content: CardContent;
  shareImageUrl?: string | null;
  isActivated: boolean;
  activatedAt?: string | null;
  activation?: {
    activationId: string;
    status: string;
    anchorType: string;
    anchorLabel: string;
    holdDurationMs?: number | null;
    sealedAt?: string | null;
  } | null;
};

type ActivationStart = {
  activationId: string;
  status: string;
  cardId: string;
  anchorType: string;
  anchorLabel: string;
  alreadyActivated: boolean;
};

type ResultActivationProps = {
  cardId: string;
};

type HoldToSealButtonProps = {
  disabled?: boolean;
  onComplete: (holdDurationMs: number) => void;
  onCancel?: (holdDurationMs: number) => void;
};

export function ResultPageFlow({ cardId }: ResultActivationProps) {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "saving" | "sharing">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCard() {
      setStatus("loading");
      setMessage(null);
      try {
        const identity = readAnonymousIdentity();
        if (!identity) {
          throw new Error("Start from the draw flow so AuraCue can match this card to your device.");
        }
        await apiClient.getAuraCard(cardId);
        await apiClient.renderAuraCard(cardId, { anonymousId: identity, platform });
        if (!cancelled) {
          setAnonymousId(identity);
          setCard(await apiClient.getAuraCard(cardId));
          setStatus("ready");
          void track("view_result_free", { cardId }, { anonymousId: identity });
        }
      } catch (caught) {
        if (!cancelled) {
          setStatus("error");
          setMessage(toUserMessage(caught));
        }
      }
    }
    void loadCard();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  async function saveFromResult() {
    if (!anonymousId || status === "saving") {
      return;
    }
    setStatus("saving");
    setMessage(null);
    try {
      await apiClient.saveCard(cardId, { anonymousId, platform, source: "result" });
      setMessage("Saved to your AuraCue collection.");
      setStatus("ready");
      void track("card_saved", { cardId, source: "result" }, { anonymousId });
    } catch (caught) {
      setStatus("ready");
      setMessage(toUserMessage(caught));
    }
  }

  async function shareFromResult() {
    if (!anonymousId || status === "sharing") {
      return;
    }
    setStatus("sharing");
    setMessage(null);
    try {
      const shared = await apiClient.shareCard(cardId, {
        anonymousId,
        platform,
        channel: "web_share",
        source: "result"
      });
      setMessage(`Share preview ready at ${shared.shareUrl}.`);
      setStatus("ready");
      void track("share_card", { cardId, channel: "web_share" }, { anonymousId });
    } catch (caught) {
      setStatus("ready");
      setMessage(toUserMessage(caught));
    }
  }

  return (
    <WebShell title="Your Full Reading" eyebrow={null} referenceId="result">
      <div className="auracue-flow auracue-flow--result">
        <p className="auracue-flow__lead auracue-flow__lead--result">
          Here&apos;s the energy aligned just for you.
        </p>
        {status === "loading" ? <LoadingState title="Opening card" message="Loading your full AuraCue reading." /> : null}
        {status === "error" ? <ErrorState title="Card unavailable" message={message ?? "Card could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? <AuraCardReport card={card} /> : null}
        {message && status !== "error" ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
        {card ? (
          <div className="auracue-flow__actions">
            <button className="auracue-secondary-action auracue-secondary-action--result" type="button" onClick={saveFromResult} disabled={status === "saving"}>
              {status === "saving" ? "Saving..." : "Save Card"}
            </button>
            <button className="auracue-secondary-action auracue-secondary-action--result" type="button" onClick={shareFromResult} disabled={status === "sharing"}>
              {status === "sharing" ? "Sharing..." : "Share Story"}
            </button>
            <Link className="auracue-primary-action auracue-link-action" href={card.isActivated ? `/activated/${cardId}` : `/activate/${cardId}`}>
              {card.isActivated ? "View Activated Aura" : "Activate My Aura"}
            </Link>
          </div>
        ) : null}
      </div>
    </WebShell>
  );
}

export function ActivatePageFlow({ cardId }: ResultActivationProps) {
  const router = useRouter();
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<{ type: string; label: string } | null>(null);
  const [activation, setActivation] = useState<ActivationStart | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "starting" | "holding" | "sealing" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  const anchors = useMemo(() => anchorCandidates(card), [card]);

  useEffect(() => {
    let cancelled = false;
    async function loadActivationCard() {
      setStatus("loading");
      setMessage(null);
      try {
        const identity = readAnonymousIdentity();
        if (!identity) {
          throw new Error("Start from the draw flow so activation can be linked to your card.");
        }
        const nextCard = await apiClient.getAuraCard(cardId);
        if (nextCard.isActivated) {
          router.replace(`/activated/${cardId}`);
          return;
        }
        if (!cancelled) {
          setAnonymousId(identity);
          setCard(nextCard);
          setSelectedAnchor(anchorCandidates(nextCard)[0] ?? null);
          setStatus("ready");
          void track("activation_page_view", { cardId }, { anonymousId: identity });
        }
      } catch (caught) {
        if (!cancelled) {
          setStatus("error");
          setMessage(toUserMessage(caught));
        }
      }
    }
    void loadActivationCard();
    return () => {
      cancelled = true;
    };
  }, [cardId, router]);

  async function startActivation() {
    if (!anonymousId || !selectedAnchor || status === "starting" || activation) {
      return;
    }
    setStatus("starting");
    setMessage(null);
    try {
      const started = await apiClient.startActivation(cardId, {
        anonymousId,
        platform,
        anchorType: selectedAnchor.type,
        anchorLabel: selectedAnchor.label
      });
      setActivation(started);
      setStatus("holding");
      void track("activation_started", { cardId, anchorType: selectedAnchor.type }, { anonymousId });
    } catch (caught) {
      setStatus("ready");
      setMessage(toUserMessage(caught));
    }
  }

  async function seal(holdDurationMs: number) {
    if (!anonymousId || !activation || status === "sealing") {
      return;
    }
    setStatus("sealing");
    setMessage(null);
    try {
      const sealed = await apiClient.sealActivation(activation.activationId, {
        anonymousId,
        platform,
        holdDurationMs
      });
      void track("aura_activated", {
        cardId,
        activationId: activation.activationId,
        holdDurationMs: sealed.holdDurationMs
      }, { anonymousId });
      router.push(`/activated/${sealed.cardId}`);
    } catch (caught) {
      setStatus("holding");
      setMessage(toUserMessage(caught));
    }
  }

  function cancelHold(holdDurationMs: number) {
    if (anonymousId) {
      void track("activation_hold_cancelled", { cardId, holdDurationMs }, { anonymousId });
    }
  }

  return (
    <WebShell title="Seal today's aura." eyebrow="Activate" referenceId="activate">
      <div className="auracue-flow">
        {status === "loading" ? <LoadingState title="Preparing seal" message="Loading anchors from your aura card." /> : null}
        {status === "error" ? <ErrorState title="Activation unavailable" message={message ?? "Activation could not start."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <p className="auracue-flow__lead">Choose one anchor, then hold the seal for 3 seconds.</p>
            <div className="auracue-option-list" aria-label="Activation anchors">
              {anchors.map((anchor) => (
                <button
                  key={`${anchor.type}:${anchor.label}`}
                  className="auracue-choice"
                  type="button"
                  aria-pressed={selectedAnchor?.type === anchor.type && selectedAnchor?.label === anchor.label}
                  disabled={Boolean(activation)}
                  onClick={() => {
                    setSelectedAnchor(anchor);
                    void track("activation_anchor_selected", { cardId, anchorType: anchor.type });
                  }}
                >
                  <strong>{anchor.label}</strong>
                  <span>{anchorLabel(anchor.type)}</span>
                </button>
              ))}
            </div>
            {!activation ? (
              <button className="auracue-primary-action" type="button" disabled={!selectedAnchor || status === "starting"} onClick={startActivation}>
                {status === "starting" ? "Starting seal..." : "Start Activation"}
              </button>
            ) : (
              <HoldToSealButton disabled={status === "sealing"} onComplete={seal} onCancel={cancelHold} />
            )}
            {message ? <div className="auracue-inline-state auracue-inline-state--error" role="alert">{message}</div> : null}
            <p className="auracue-flow__safe">Release before 3 seconds to cancel. A short hold will not seal the card.</p>
          </>
        ) : null}
      </div>
    </WebShell>
  );
}

export function ActivatedPageFlow({ cardId }: ResultActivationProps) {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "sharing" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadActivated() {
      setStatus("loading");
      setMessage(null);
      try {
        const identity = readAnonymousIdentity();
        if (!identity) {
          throw new Error("Open this card from the original AuraCue device session.");
        }
        const nextCard = await apiClient.getAuraCard(cardId);
        if (!nextCard.isActivated) {
          throw new Error("This aura has not been sealed yet.");
        }
        if (!cancelled) {
          setAnonymousId(identity);
          setCard(nextCard);
          setStatus("ready");
        }
      } catch (caught) {
        if (!cancelled) {
          setStatus("error");
          setMessage(toUserMessage(caught));
        }
      }
    }
    void loadActivated();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  async function shareActivated() {
    if (!anonymousId || status === "sharing") {
      return;
    }
    setStatus("sharing");
    setMessage(null);
    try {
      const shared = await apiClient.shareCard(cardId, {
        anonymousId,
        platform,
        channel: "web_share",
        source: "activated"
      });
      setStatus("ready");
      setMessage(`Share preview ready at ${shared.shareUrl}.`);
      void track("share_card", { cardId, channel: "web_share", source: "activated" }, { anonymousId });
    } catch (caught) {
      setStatus("ready");
      setMessage(toUserMessage(caught));
    }
  }

  return (
    <WebShell title="Aura Activated" eyebrow={null} referenceId="activated">
      <div className="auracue-flow auracue-flow--activated">
        {status === "loading" ? <LoadingState title="Checking seal" message="Confirming today's activated aura." /> : null}
        {status === "error" ? <ErrorState title="Activated card unavailable" message={message ?? "Activated card could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <div className="auracue-activated-star" aria-hidden="true" />
            <h1 className="auracue-activated-title">Aura Activated</h1>
            <p className="auracue-flow__lead auracue-flow__lead--activated">
              Golden Bloom is active for today.
            </p>
            <div className="auracue-activated-card" role="status">
              <span>Today&apos;s Aura</span>
              <strong>{card.content.auraName ?? card.content.title ?? "Golden Bloom"}</strong>
              <p><b>Lucky Color:</b> {card.content.luckyColor ?? "Blush Pink"}</p>
              <p><b>Lucky Anchor:</b> {card.activation?.anchorLabel ?? "Jewelry"}</p>
              <em>Notice where your soft power shows up.</em>
            </div>
            {message ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
            <div className="auracue-flow__actions auracue-flow__actions--activated">
              <Link className="auracue-secondary-action auracue-link-action auracue-secondary-action--activated-done" href={`/share/${cardId}`}>
                <span aria-hidden="true">✓</span>
                Done
              </Link>
              <button className="auracue-secondary-action auracue-secondary-action--activated-share" type="button" onClick={shareActivated} disabled={status === "sharing"}>
                <span aria-hidden="true">↥</span>
                {status === "sharing" ? "Sharing..." : "Share Story"}
              </button>
            </div>
            <p className="auracue-flow__safe auracue-flow__safe--activated">Private. Personal. Just for you.</p>
          </>
        ) : null}
      </div>
    </WebShell>
  );
}

export function HoldToSealButton({ disabled = false, onComplete, onCancel }: HoldToSealButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  const completed = useRef(false);

  useEffect(() => () => clearHoldTimers(), []);

  function startHold(event: PointerEvent<HTMLButtonElement>) {
    if (disabled || holding) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    completed.current = false;
    startedAt.current = performance.now();
    setHolding(true);
    setProgress(0);
    timer.current = window.setTimeout(() => {
      if (startedAt.current === null || completed.current) {
        return;
      }
      completed.current = true;
      const holdDurationMs = Math.max(holdToSealDurationMs, Math.round(performance.now() - startedAt.current));
      clearHoldTimers();
      setHolding(false);
      setProgress(100);
      onComplete(holdDurationMs);
    }, holdToSealDurationMs);
    tickProgress();
  }

  function cancelHold() {
    if (!holding || completed.current) {
      return;
    }
    const holdDurationMs = startedAt.current === null ? 0 : Math.round(performance.now() - startedAt.current);
    clearHoldTimers();
    setHolding(false);
    setProgress(0);
    onCancel?.(holdDurationMs);
  }

  function tickProgress() {
    frame.current = window.requestAnimationFrame(() => {
      if (startedAt.current === null || completed.current) {
        return;
      }
      const elapsed = performance.now() - startedAt.current;
      setProgress(Math.min(99, Math.round((elapsed / holdToSealDurationMs) * 100)));
      tickProgress();
    });
  }

  function clearHoldTimers() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    startedAt.current = null;
  }

  return (
    <button
      className="auracue-hold-seal"
      type="button"
      disabled={disabled}
      data-holding={holding ? "true" : "false"}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      style={{ "--auracue-hold-progress": `${progress}%` } as CSSProperties}
    >
      <span>{disabled ? "Sealing..." : holding ? "Keep holding..." : "Hold 3s to Seal"}</span>
      <small>{progress}%</small>
    </button>
  );
}

function AuraCardReport({ card, compact = false }: { card: AuraCard; compact?: boolean }) {
  const content = card.content || {};
  const fields = [
    ["Lucky color", content.luckyColor],
    ["Style vibe", content.styleVibe],
    ["Energy message", content.energyMessage],
    ["Outfit energy", content.outfitEnergy],
    ["Beauty cue", content.beautyCue],
    ["Social move", content.socialMove],
    ["Mini ritual", content.miniRitual],
    ["Today intention", content.todayIntention]
  ].filter(([, value]) => typeof value === "string" && value.length > 0);

  return (
    <article className="auracue-result-card">
      <div className="auracue-result-card__hero">
        <div className="auracue-result-card__hero-copy">
          <h2>{content.auraName ?? content.title ?? "Quiet Power Bloom"}</h2>
          <p>{content.shareCaption ?? content.energyMessage ?? "Steady confidence. Soft presence."}</p>
          <span>{card.context ? `${card.context} · ` : ""}{content.styleVibe ?? "Confidence"}</span>
          <em>Lucky Color: {content.luckyColor ?? "Blush Pink"}</em>
        </div>
        <Image className="auracue-result-card__hero-person" src="/aura-assets/mood-confident-woman-art.png" alt="" width={240} height={180} />
        <Image className="auracue-result-card__hero-rose" src="/aura-assets/mood-romantic-rose-art.png" alt="" width={200} height={160} />
      </div>
      {!compact ? (
        <dl className="auracue-result-card__details">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <p className="auracue-flow__safe">
        {content.safetyDisclaimer ?? "For reflection and fun. Not a guarantee or professional advice."}
      </p>
    </article>
  );
}

function anchorCandidates(card: AuraCard | null) {
  const candidates = card?.content?.luckyAnchorCandidates ?? [];
  const normalized = candidates
    .map((candidate) => ({
      type: typeof candidate.type === "string" && candidate.type ? candidate.type : "lucky_color",
      label: typeof candidate.label === "string" && candidate.label ? candidate.label : null
    }))
    .filter((candidate): candidate is { type: string; label: string } => Boolean(candidate.label));
  if (normalized.length > 0) {
    return normalized.slice(0, 3);
  }
  const fallback = card?.content?.luckyColor || card?.content?.auraName || "today's lucky cue";
  return [{ type: "lucky_color", label: fallback }];
}

function anchorLabel(type: string) {
  if (type === "outfit_detail") {
    return "Outfit detail";
  }
  if (type === "jewelry") {
    return "Jewelry cue";
  }
  return "Lucky color";
}

function readAnonymousIdentity() {
  return window.localStorage.getItem(anonymousStorageKey);
}

function toUserMessage(error: unknown) {
  if (error instanceof AuraCueApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "The request could not be completed.";
}
