"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
  { id: "confident", label: "Confident", detail: "Clear signal, polished choices" },
  { id: "calm", label: "Calm", detail: "Soft pace, quiet glow" },
  { id: "lucky", label: "Lucky", detail: "Open doors, bright timing" },
  { id: "magnetic", label: "Magnetic", detail: "Social spark, warm presence" },
  { id: "focused", label: "Focused", detail: "Sharp lines, steady rhythm" },
  { id: "romantic", label: "Romantic", detail: "Blush notes, gentle charm" },
  { id: "brave", label: "Brave", detail: "Bold cue, grounded step" },
  { id: "rested", label: "Rested", detail: "Clean reset, fresh light" }
];

const contexts = ["Date", "Work", "Party", "Interview", "Travel", "Just for luck"];

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      setLoading(true);
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
      } finally {
        if (!cancelled) {
          setLoading(false);
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
    <WebShell title="How do you want to feel today?" eyebrow="Mood" referenceId="home">
      <div className="auracue-flow">
        <p className="auracue-flow__lead">
          Pick one mood and we&apos;ll turn it into your lucky aura card.
        </p>
        {loading ? <LoadingState title="Preparing today" message="Checking your AuraCue draft." /> : null}
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
        <div className="auracue-mood-grid" aria-label="Mood options">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              className="auracue-choice"
              aria-pressed={selectedMood === mood.id}
              onClick={() => chooseMood(mood.id)}
            >
              <strong>{mood.label}</strong>
              <span>{mood.detail}</span>
            </button>
          ))}
        </div>
        <p className="auracue-flow__hint">Lucky color · Style vibe · Tiny ritual · Aura anchor</p>
        <p className="auracue-flow__safe">For reflection and fun. Not a guarantee or professional advice.</p>
        <button
          className="auracue-primary-action"
          type="button"
          disabled={!selectedMood}
          onClick={startFlow}
        >
          Start My Aura Card
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
    const next = draftStore.save({ context: context.toLowerCase() });
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
    <WebShell title="What is today for?" eyebrow="Context" referenceId="context">
      <div className="auracue-flow">
        <div className="auracue-option-list" aria-label="Context options">
          {contexts.map((context) => (
            <button
              key={context}
              type="button"
              className="auracue-choice"
              aria-pressed={draft.context === context.toLowerCase()}
              onClick={() => selectContext(context)}
            >
              <strong>{context}</strong>
              <span>{context === "Just for luck" ? "Keep it open" : "Tune the card for this moment"}</span>
            </button>
          ))}
        </div>
        <div className="auracue-flow__actions">
          <button className="auracue-secondary-action" type="button" onClick={skipContext}>
            Skip
          </button>
          <button className="auracue-primary-action" type="button" onClick={() => continueFlow()}>
            Continue
          </button>
        </div>
      </div>
    </WebShell>
  );
}

export function UploadPageFlow() {
  const router = useRouter();
  const draftStore = useMemo(() => createDraftStore(), []);
  const [draft, setDraft] = useState<Draft>(() => draftStore.load());
  const [uploadName, setUploadName] = useState<string | null>(null);
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
      setUploadName(file.name);
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
    <WebShell title="Add today&apos;s outfit?" eyebrow="Upload" referenceId={status === "error" ? "error" : "upload"}>
      <div className="auracue-flow">
        <label className="auracue-upload-zone">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            disabled={status === "uploading"}
          />
          <span>{status === "uploading" ? "Uploading..." : "Choose jpg, png, or webp"}</span>
          <strong>{uploadName ?? "Outfit upload is optional"}</strong>
        </label>
        {message ? (
          <div className={`auracue-inline-state auracue-inline-state--${status}`} role={status === "error" ? "alert" : "status"}>
            {message}
          </div>
        ) : null}
        <p className="auracue-flow__safe">
          AuraCue reads color and style cues only. It does not judge bodies, faces, or appearance flaws.
        </p>
        <div className="auracue-flow__actions">
          <button className="auracue-secondary-action" type="button" onClick={skipUpload}>
            Skip
          </button>
          {status === "error" ? (
            <button className="auracue-secondary-action" type="button" onClick={retryUpload}>
              Retry
            </button>
          ) : null}
          <button className="auracue-primary-action" type="button" onClick={continueFlow}>
            Continue
          </button>
        </div>
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
    <WebShell title="Choose the card that calls you." eyebrow="Draw" referenceId="draw">
      <div className="auracue-flow">
        <p className="auracue-flow__lead">Tap one card to draw today&apos;s aura.</p>
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
        <button
          className="auracue-primary-action"
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
