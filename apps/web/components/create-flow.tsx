"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { WebShell } from "@/components/web-shell";
import { apiClient, AuraCueApiError } from "@/lib/api-client.js";
import { createDraftStore } from "@/lib/draft-store.js";
import { track } from "@/lib/analytics.js";

const platform = "web";
const anonymousStorageKey = "auracue:web:anonymous-id:v1";
const maxUploadBytes = 8 * 1024 * 1024;
const acceptedUploadTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const moods = [
  {
    id: "confident",
    label: "Confident",
    detail: "Walk in your power and shine today.",
    energy: "High Energy",
    asset: "/aura-assets/mood-confident-woman-art.png",
    tone: "violet",
    icon: "/aura-assets/common-sparkle-gold.png"
  },
  {
    id: "romantic",
    label: "Romantic",
    detail: "Open your heart to love and beautiful moments.",
    energy: "Love Energy",
    asset: "/aura-assets/mood-romantic-rose-art.png",
    tone: "rose",
    icon: "/aura-assets/home-mood-romantic-heart.png"
  },
  {
    id: "calm",
    label: "Calm",
    detail: "Breathe deep and find your inner peace.",
    energy: "Peace Energy",
    asset: "/aura-assets/mood-calm-lotus-stones-art.png",
    tone: "lavender",
    icon: "/aura-assets/home-mood-calm-leaf.png"
  }
];

const contexts = [
  { label: "Date", value: "date", asset: "/aura-assets/context-option-date-heart.png" },
  { label: "Work", value: "work", asset: "/aura-assets/context-option-work-briefcase.png" },
  { label: "Party", value: "party", asset: "/aura-assets/context-option-party-hat.png" },
  { label: "Interview", value: "interview", asset: "/aura-assets/context-option-interview-clipboard.png" },
  { label: "Travel", value: "travel", asset: "/aura-assets/context-option-travel-suitcase.png" },
  { label: "Just for luck", value: "just for luck", asset: "/aura-assets/context-option-luck-clover.png" }
];

type TodayCard = {
  hasActiveCard: boolean;
  cardId?: string;
  auraName?: string;
};

type DrawCard = {
  position: number;
  label: string;
};

type DrawSession = {
  drawSessionId: string;
  drawSeed: string;
  expiresAt: string;
  cards: DrawCard[];
};

type Draft = {
  mood: string | null;
  context: string | null;
  uploadId: string | null;
  drawSessionId: string | null;
  drawPosition: number | null;
};

export function MoodHome() {
  const router = useRouter();
  const draftStore = useMemo(() => createDraftStore(), []);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [todayCard, setTodayCard] = useState<TodayCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      setError(null);
      try {
        const identity = await ensureAnonymousIdentity();
        if (cancelled) {
          return;
        }
        setAnonymousId(identity);
        setSelectedMood(draftStore.load().mood);
        const today = await apiClient.getTodayCard({ anonymousId: identity });
        if (!cancelled) {
          setTodayCard(today);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(toUserMessage(caught));
        }
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [draftStore]);

  function chooseMood(mood: string) {
    setSelectedMood(mood);
    draftStore.save({ mood, context: null, uploadId: null, drawSessionId: null, drawPosition: null });
    void track("select_mood", { mood }, { anonymousId });
  }

  function startFlow() {
    if (!selectedMood) {
      return;
    }
    void track("click_start_card", { mood: selectedMood }, { anonymousId });
    router.push("/create/context");
  }

  return (
    <WebShell title="Start Your Aura Journey" eyebrow="Today, 18 Jul 2024" referenceId="home">
      <div className="auracue-flow auracue-flow--home">
        <p className="auracue-flow__lead">
          Choose today&apos;s mood to reveal your lucky aura card.
        </p>
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {todayCard?.hasActiveCard && todayCard.cardId ? (
          <button
            className="auracue-active-entry"
            type="button"
            onClick={() => router.push(`/activated/${todayCard.cardId}`)}
          >
            <span>Today&apos;s Aura Active</span>
            <strong>{todayCard.auraName ?? "Open activated card"}</strong>
          </button>
        ) : null}
        <div className="auracue-filter-row" aria-label="Mood filters">
          <button type="button" className="auracue-filter auracue-filter--active">
            All <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={16} height={16} />
          </button>
          <button type="button" className="auracue-filter">
            <Image src="/aura-assets/home-mood-calm-leaf.png" alt="" width={18} height={18} /> Calm
          </button>
          <button type="button" className="auracue-filter">
            <Image src="/aura-assets/home-mood-romantic-heart.png" alt="" width={18} height={18} /> Romantic
          </button>
          <button type="button" className="auracue-filter">
            <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} /> Lucky
          </button>
        </div>
        <div className="auracue-mood-stack" aria-label="Mood options">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              className={`auracue-mood-card auracue-mood-card--${mood.tone}`}
              aria-pressed={selectedMood === mood.id}
              onClick={() => chooseMood(mood.id)}
            >
              <span className="auracue-mood-card__copy">
                <strong>{mood.label}</strong>
                <span>{mood.detail}</span>
                <em>{mood.energy}</em>
              </span>
              <Image className="auracue-mood-card__art" src={mood.asset} alt="" width={240} height={180} />
              <span className="auracue-mood-card__check" aria-hidden="true" />
            </button>
          ))}
        </div>
        <button
          className="auracue-primary-action auracue-primary-action--home"
          type="button"
          disabled={!selectedMood}
          onClick={startFlow}
        >
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
          Start My Aura Card
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
        </button>
      </div>
    </WebShell>
  );
}

export function ContextPageFlow() {
  const router = useRouter();
  const draftStore = useMemo(() => createDraftStore(), []);
  const [draft, setDraft] = useState<Draft>(() => draftStore.load());

  useEffect(() => {
    if (!draft.mood) {
      router.replace("/");
    }
  }, [draft.mood, router]);

  function selectContext(context: string) {
    const next = draftStore.save({ context });
    setDraft(next);
    void track("select_context", { context });
  }

  function continueFlow(context: string | null = draft.context) {
    draftStore.save({ context });
    router.push("/create/upload");
  }

  function skipContext() {
    draftStore.save({ context: "skip" });
    void track("skip_context", {});
    router.push("/create/upload");
  }

  return (
    <WebShell title="Any context for today?" eyebrow={null} referenceId="context">
      <div className="auracue-flow auracue-flow--context">
        <p className="auracue-flow__lead auracue-flow__lead--context">
          Optional - add a scene if you want us to tune your card a little more. <span aria-hidden="true">💖</span>
        </p>
        <div className="auracue-option-list" aria-label="Context options">
          {contexts.map((context) => (
            <button
              key={context.value}
              type="button"
              className="auracue-choice"
              aria-pressed={draft.context === context.value}
              onClick={() => selectContext(context.value)}
            >
              <Image className="auracue-choice__icon" src={context.asset} alt="" width={76} height={76} />
              <strong>{context.label}</strong>
              {draft.context === context.value ? (
                <Image
                  className="auracue-choice__check"
                  src="/aura-assets/context-option-selected-check.png"
                  alt=""
                  width={34}
                  height={34}
                />
              ) : null}
            </button>
          ))}
        </div>
        <div className="auracue-context-divider" aria-hidden="true">
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={16} height={16} />
        </div>
        <button className="auracue-context-skip" type="button" onClick={skipContext}>
          Skip
        </button>
        <div className="auracue-flow__actions auracue-flow__actions--context">
          <button className="auracue-primary-action" type="button" onClick={() => continueFlow()}>
            <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
            Continue
            <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
          </button>
        </div>
        <p className="auracue-flow__safe auracue-flow__safe--context">
          Optional and private. You can skip this.
        </p>
      </div>
    </WebShell>
  );
}

export function UploadPageFlow() {
  const router = useRouter();
  const draftStore = useMemo(() => createDraftStore(), []);
  const [draft, setDraft] = useState<Draft>(() => draftStore.load());
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!draft.mood) {
      router.replace("/");
    }
  }, [draft.mood, router]);

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!acceptedUploadTypes.has(file.type)) {
      failUpload("Upload must be a jpg, png, or webp image.");
      return;
    }
    if (file.size > maxUploadBytes) {
      failUpload("Upload must be 8MB or smaller.");
      return;
    }
    setStatus("uploading");
    setMessage(null);
    try {
      const anonymousId = await ensureAnonymousIdentity();
      const uploaded = await apiClient.uploadOutfit({ anonymousId, platform, file });
      const next = draftStore.save({ uploadId: uploaded.uploadId, drawSessionId: null, drawPosition: null });
      setDraft(next);
      setStatus("success");
      setMessage("Upload added. You can continue or skip it.");
      void track("upload_outfit_success", { uploadId: uploaded.uploadId }, { anonymousId });
    } catch (caught) {
      failUpload(toUserMessage(caught));
    }
  }

  function failUpload(nextMessage: string) {
    setStatus("error");
    setMessage(nextMessage);
    void track("upload_outfit_failed", { reason: nextMessage });
  }

  function retryUpload() {
    setStatus("idle");
    setMessage(null);
    inputRef.current?.click();
  }

  function skipUpload() {
    draftStore.save({ uploadId: null, drawSessionId: null, drawPosition: null });
    void track("skip_upload", {});
    router.push("/create/draw");
  }

  function continueFlow() {
    router.push("/create/draw");
  }

  return (
    <WebShell title="Upload today's outfit?" eyebrow={null} referenceId={status === "error" ? "error" : "upload"}>
      <div className="auracue-flow auracue-flow--upload">
        <p className="auracue-flow__lead auracue-flow__lead--upload">
          Optional - add a look for a more personalized card, or let AuraCue read your mood only.
        </p>
        <label className="auracue-upload-zone auracue-upload-zone--hero">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            disabled={status === "uploading"}
          />
          <Image className="auracue-upload-zone__art" src="/aura-assets/upload-outfit-hero-dress.png" alt="" width={260} height={260} />
          <span className="auracue-upload-zone__camera">
            <Image src="/aura-assets/upload-action-camera.png" alt="" width={52} height={52} />
          </span>
          <strong>{status === "uploading" ? "Uploading..." : "Add a photo of your outfit"}</strong>
          <span>
            Good lighting works best.
            <br />
            We&apos;ll keep it private.
          </span>
          {status === "success" ? <em className="auracue-visually-hidden">Upload added. You can continue or skip it.</em> : null}
        </label>
        {message && status === "error" ? (
          <div className="auracue-inline-state auracue-inline-state--error" role="alert">
            {message}
          </div>
        ) : null}
        {status === "error" ? (
          <button className="auracue-secondary-action" type="button" onClick={retryUpload}>
            Retry
          </button>
        ) : null}
        <button
          className="auracue-primary-action auracue-primary-action--upload"
          type="button"
          onClick={status === "success" ? continueFlow : () => inputRef.current?.click()}
          disabled={status === "uploading"}
        >
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
          Upload Outfit
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={18} height={18} />
        </button>
        <button className="auracue-upload-skip" type="button" onClick={skipUpload}>
          Skip for Today
        </button>
        <p className="auracue-flow__safe auracue-flow__safe--upload">
          <Image src="/aura-assets/upload-privacy-shield.png" alt="" width={16} height={16} />
          Private. Personal. Just for you.
        </p>
      </div>
    </WebShell>
  );
}

export function DrawPageFlow() {
  const router = useRouter();
  const draftStore = useMemo(() => createDraftStore(), []);
  const [draft, setDraft] = useState<Draft>(() => draftStore.load());
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [session, setSession] = useState<DrawSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function startSession() {
      if (!draft.mood) {
        router.replace("/");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const identity = await ensureAnonymousIdentity();
        const created = await apiClient.startDrawSession({
          anonymousId: identity,
          platform,
          mood: draft.mood,
          context: draft.context,
          uploadId: draft.uploadId
        });
        if (cancelled) {
          return;
        }
        setAnonymousId(identity);
        setSession(created);
        setDraft(draftStore.save({ drawSessionId: created.drawSessionId }));
        void track("draw_session_started", { drawSessionId: created.drawSessionId }, { anonymousId: identity });
      } catch (caught) {
        if (!cancelled) {
          setError(toUserMessage(caught));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void startSession();
    return () => {
      cancelled = true;
    };
  }, [draft.context, draft.mood, draft.uploadId, draftStore, router]);

  function selectCard(position: number) {
    if (generating) {
      return;
    }
    setDraft(draftStore.save({ drawPosition: position }));
    void track("draw_card_selected", { drawPosition: position }, { anonymousId });
  }

  async function revealAura() {
    if (!anonymousId || !session || !draft.drawPosition || generating) {
      return;
    }
    setGenerating(true);
    setError(null);
    void track("generation_started", { drawSessionId: session.drawSessionId, drawPosition: draft.drawPosition }, { anonymousId });
    try {
      const generation = await apiClient.startGeneration({
        anonymousId,
        platform,
        drawSessionId: session.drawSessionId,
        drawPosition: draft.drawPosition
      });
      if (!generation.cardId) {
        throw new Error("Generation completed without a card.");
      }
      void track("generation_completed", { cardId: generation.cardId }, { anonymousId });
      router.push(`/result/${generation.cardId}`);
    } catch (caught) {
      setError(toUserMessage(caught));
      setGenerating(false);
      void track("generation_failed", { reason: toUserMessage(caught) }, { anonymousId });
    }
  }

  return (
    <WebShell title="Choose the card that calls you." eyebrow={null} referenceId="draw">
      <div className="auracue-flow auracue-flow--draw">
        <p className="auracue-flow__lead auracue-flow__lead--draw">Take one breath. Let today&apos;s aura find you.</p>
        {loading ? <LoadingState title="Starting draw" message="Preparing three cards for your mood." /> : null}
        {error ? <ErrorState title="Reveal failed" message={error} retryLabel="Retry" onRetry={session ? revealAura : () => window.location.reload()} /> : null}
        <div className="auracue-card-row" aria-label="Draw cards">
          {(session?.cards ?? [
            { position: 1, label: "Card I" },
            { position: 2, label: "Card II" },
            { position: 3, label: "Card III" }
          ]).map((card) => (
            <button
              key={card.position}
              type="button"
              className="auracue-draw-card"
              aria-pressed={draft.drawPosition === card.position}
              disabled={loading || generating}
              onClick={() => selectCard(card.position)}
            >
              <span>{card.label}</span>
            </button>
          ))}
        </div>
        <p className="auracue-draw-tap">Tap one card to draw today&apos;s aura.</p>
        <p className="auracue-draw-ritual">30-second ritual · private · just for you</p>
        <button
          className="auracue-primary-action auracue-primary-action--draw"
          type="button"
          disabled={!session || !draft.drawPosition || generating}
          onClick={revealAura}
        >
          {generating ? "Revealing your aura..." : "Reveal My Aura"}
        </button>
      </div>
    </WebShell>
  );
}

async function ensureAnonymousIdentity() {
  const stored = window.localStorage.getItem(anonymousStorageKey);
  const identity = await apiClient.createAnonymousIdentity({
    platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    anonymousId: stored || undefined
  });
  window.localStorage.setItem(anonymousStorageKey, identity.anonymousId);
  return identity.anonymousId;
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
