"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { WebShell } from "@/components/web-shell";
import { apiClient, AuraCueApiError } from "@/lib/api-client.js";
import { track } from "@/lib/analytics.js";

const platform = "web";
const anonymousStorageKey = "auracue:web:anonymous-id:v1";

type CardContent = {
  title?: string;
  auraName?: string;
  tarotSymbol?: string;
  luckyColor?: string;
  styleVibe?: string;
  energyMessage?: string;
  shareCaption?: string;
  safetyDisclaimer?: string;
};

type AuraCard = {
  cardId: string;
  drawPosition?: number | null;
  content: CardContent;
  shareImageUrl?: string | null;
  isActivated: boolean;
  activatedAt?: string | null;
  activation?: {
    status: string;
    anchorLabel?: string | null;
    sealedAt?: string | null;
  } | null;
};

type RenderedCard = {
  shareImageUrl?: string | null;
  width?: number;
  height?: number;
  reused?: boolean;
};

type ShareSaveProps = {
  cardId: string;
};

type ActionStatus = "idle" | "copying" | "sharing" | "downloading" | "saving";

export function SharePageFlow({ cardId }: ShareSaveProps) {
  const router = useRouter();
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [actionStatus, setActionStatus] = useState<ActionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [renderFallback, setRenderFallback] = useState(false);

  const shareUrl = useMemo(() => buildShareUrl(cardId), [cardId]);

  useEffect(() => {
    let cancelled = false;
    async function loadSharePage() {
      setStatus("loading");
      setMessage(null);
      setRenderFallback(false);
      try {
        const identity = readAnonymousIdentity();
        if (!identity) {
          throw new Error("Open this share page from the original AuraCue device session.");
        }
        const nextCard = await apiClient.getAuraCard(cardId);
        let imageUrl = nextCard.shareImageUrl ?? null;
        if (!imageUrl) {
          try {
            const rendered: RenderedCard = await apiClient.renderAuraCard(cardId, { anonymousId: identity, platform });
            imageUrl = rendered.shareImageUrl ?? null;
          } catch {
            setRenderFallback(true);
          }
        }
        if (!cancelled) {
          setAnonymousId(identity);
          setCard(nextCard);
          setShareImageUrl(imageUrl);
          setStatus("ready");
          void track("share_opened", { cardId, hasShareImage: Boolean(imageUrl) }, { anonymousId: identity });
        }
      } catch (caught) {
        if (!cancelled) {
          setStatus("error");
          setMessage(toUserMessage(caught));
        }
      }
    }
    void loadSharePage();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  async function copyLink() {
    if (!anonymousId || actionStatus !== "idle") {
      return;
    }
    setActionStatus("copying");
    setMessage(null);
    try {
      const copied = await copyTextToClipboard(shareUrl);
      await apiClient.shareCard(cardId, { anonymousId, platform, channel: "copy", source: "share_preview" });
      setMessage(copied ? "Share link copied." : `Copy this link: ${shareUrl}`);
      void track("share_completed", { cardId, channel: "copy", copied }, { anonymousId });
    } catch (caught) {
      setMessage(toUserMessage(caught));
    } finally {
      setActionStatus("idle");
    }
  }

  async function shareCard() {
    if (!anonymousId || actionStatus !== "idle") {
      return;
    }
    setActionStatus("sharing");
    setMessage(null);
    try {
      const nativeShared = await shareWithNativeWebApi({
        title: "AuraCue daily aura",
        text: card?.content?.shareCaption ?? card?.content?.energyMessage ?? "My AuraCue card is ready.",
        url: shareUrl
      });
      const channel = nativeShared ? "web_share" : "copy";
      if (!nativeShared) {
        await copyTextToClipboard(shareUrl);
      }
      await apiClient.shareCard(cardId, { anonymousId, platform, channel, source: "share_preview" });
      setMessage(nativeShared ? "Shared from your browser." : "Web Share is unavailable, so the link was copied.");
      void track("share_completed", { cardId, channel, nativeShared }, { anonymousId });
    } catch (caught) {
      setMessage(toUserMessage(caught));
    } finally {
      setActionStatus("idle");
    }
  }

  async function saveImage() {
    if (!anonymousId || actionStatus !== "idle") {
      return;
    }
    setActionStatus("downloading");
    setMessage(null);
    try {
      const downloadUrl = shareImageUrl && !shareImageUrl.startsWith("local://") ? shareImageUrl : shareUrl;
      triggerImageDownload(downloadUrl, `auracue-${cardId}.png`);
      await apiClient.shareCard(cardId, { anonymousId, platform, channel: "download", source: "share_preview" });
      setMessage(downloadUrl === shareUrl ? "Render is local-only, so the share link was prepared instead." : "Image download started.");
      void track("share_completed", { cardId, channel: "download", hasShareImage: Boolean(shareImageUrl) }, { anonymousId });
    } catch (caught) {
      setMessage(toUserMessage(caught));
    } finally {
      setActionStatus("idle");
    }
  }

  async function saveToCollection() {
    if (!anonymousId || actionStatus !== "idle") {
      return;
    }
    setActionStatus("saving");
    setMessage(null);
    try {
      await apiClient.saveCard(cardId, { anonymousId, platform, source: "share" });
      void track("card_saved", { cardId, source: "share" }, { anonymousId });
      router.push(`/saved/${cardId}`);
    } catch (caught) {
      setMessage(toUserMessage(caught));
      setActionStatus("idle");
    }
  }

  return (
    <WebShell title="Saved to your Aura Cards" eyebrow={null} referenceId="share">
      <div className="auracue-flow auracue-flow--share">
        {status === "loading" ? <LoadingState title="Preparing share image" message="Rendering a 9:16 AuraCue preview." /> : null}
        {status === "error" ? <ErrorState title="Share unavailable" message={message ?? "Share page could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <p className="auracue-flow__lead auracue-flow__lead--share">
              Your lucky aura is ready whenever you step out.
            </p>
            <SharePreview shareImageUrl={shareImageUrl} fallback={renderFallback} />
            {renderFallback ? (
              <div className="auracue-inline-state auracue-inline-state--error" role="alert">
                Render failed. You can still copy the link or generate again.
              </div>
            ) : null}
            {message ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
            <div className="auracue-share-actions">
              <button className="auracue-share-status-row" type="button" onClick={saveImage} disabled={actionStatus !== "idle"} aria-label="Save Image">
                <Image src="/aura-assets/share-action-photos.png" alt="" width={22} height={22} />
                <span>{actionStatus === "downloading" ? "Saving to Photos" : "Saved to Photos"}</span>
                <Image src="/aura-assets/context-option-selected-check.png" alt="" width={22} height={22} />
              </button>
              <button className="auracue-share-status-row" type="button" onClick={saveToCollection} disabled={actionStatus !== "idle"} aria-label="Save to AuraCue">
                <Image src="/aura-assets/share-action-aura-cards-lotus.png" alt="" width={22} height={22} />
                <span>{actionStatus === "saving" ? "Saving to Aura Cards" : "Saved to Aura Cards"}</span>
                <Image src="/aura-assets/context-option-selected-check.png" alt="" width={22} height={22} />
              </button>
              <button className="auracue-primary-action auracue-primary-action--share" type="button" onClick={copyLink} disabled={actionStatus !== "idle"}>
                <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={16} height={16} />
                {actionStatus === "copying" ? "Preparing" : "Share Now"}
                <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={16} height={16} />
              </button>
              <Link className="auracue-secondary-action auracue-link-action auracue-link-action--share-home" href="/">
                Back Home
              </Link>
              <button className="auracue-share-text-link" type="button" onClick={shareCard} disabled={actionStatus !== "idle"}>
                View Saved Card
              </button>
            </div>
          </>
        ) : null}
      </div>
    </WebShell>
  );
}

export function SavedPageFlow({ cardId }: ShareSaveProps) {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [card, setCard] = useState<AuraCard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSavedPage() {
      setStatus("loading");
      setMessage(null);
      try {
        const identity = readAnonymousIdentity();
        if (!identity) {
          throw new Error("Open saved cards from the original AuraCue device session.");
        }
        const nextCard = await apiClient.getAuraCard(cardId);
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
    void loadSavedPage();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  async function copySavedLink() {
    if (!anonymousId) {
      return;
    }
    await copyTextToClipboard(buildShareUrl(cardId));
    await apiClient.shareCard(cardId, { anonymousId, platform, channel: "copy", source: "saved" });
    setMessage("Saved card link copied.");
    void track("share_completed", { cardId, channel: "copy", source: "saved" }, { anonymousId });
  }

  return (
    <WebShell title="Saved to your Aura Cards" eyebrow={null} referenceId="saved">
      <div className="auracue-flow auracue-flow--saved">
        {status === "loading" ? <LoadingState title="Confirming save" message="Checking the saved card details." /> : null}
        {status === "error" ? <ErrorState title="Saved card unavailable" message={message ?? "Saved card could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <p className="auracue-flow__lead auracue-flow__lead--saved">
              Your lucky aura is ready whenever you step out.
            </p>
            <SavedPreview />
            {message ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
            <div className="auracue-share-actions auracue-share-actions--saved">
              <button className="auracue-share-status-row" type="button" onClick={copySavedLink}>
                <Image src="/aura-assets/share-action-photos.png" alt="" width={22} height={22} />
                <span>Saved to Photos</span>
                <Image src="/aura-assets/context-option-selected-check.png" alt="" width={22} height={22} />
              </button>
              <button className="auracue-share-status-row" type="button" onClick={copySavedLink}>
                <Image src="/aura-assets/share-action-aura-cards-lotus.png" alt="" width={22} height={22} />
                <span>Saved to Aura Cards</span>
                <Image src="/aura-assets/context-option-selected-check.png" alt="" width={22} height={22} />
              </button>
              <button className="auracue-primary-action auracue-primary-action--saved" type="button" onClick={copySavedLink}>
                Share Now
                <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={16} height={16} />
              </button>
              <Link className="auracue-secondary-action auracue-link-action auracue-link-action--saved-home" href="/">
                Back Home
              </Link>
              <Link className="auracue-share-text-link auracue-share-text-link--saved" href={`/share/${cardId}`}>
                View Saved Card
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </WebShell>
  );
}

function SavedPreview() {
  return (
    <article className="auracue-saved-preview" aria-label="Saved aura card preview">
      <Image className="auracue-saved-preview__brand" src="/aura-assets/common-brand-lotus.png" alt="" width={28} height={18} />
      <em>Today&apos;s</em>
      <strong>Lucky Aura</strong>
      <Image className="auracue-saved-preview__portrait" src="/aura-assets/mood-confident-woman-art.png" alt="" width={170} height={160} />
      <Image className="auracue-saved-preview__rose" src="/aura-assets/mood-romantic-rose-art.png" alt="" width={120} height={96} />
      <b>Rose Aura</b>
      <span>Love · Confidence · Radiance</span>
      <div className="auracue-saved-preview__meta">
        <small>Energy<br />Bright</small>
        <small>Focus<br />Self-love</small>
        <small>Lucky color<br />Blush Pink</small>
      </div>
    </article>
  );
}

function SharePreview({ shareImageUrl, fallback }: { shareImageUrl: string | null; fallback: boolean }) {
  return (
    <article className="auracue-share-preview" aria-label="9:16 share image preview" data-render-fallback={fallback ? "true" : "false"}>
      <div className="auracue-share-preview__image" data-share-image={shareImageUrl ?? ""}>
        <Image className="auracue-share-preview__brand" src="/aura-assets/common-brand-lotus.png" alt="" width={36} height={22} />
        <span>AuraCue</span>
        <em>Today&apos;s Aura</em>
        <strong>Soft Confidence</strong>
        <small>Romantic clarity</small>
        <p>You move with grace. You trust your voice. You are already enough.</p>
        <Image className="auracue-share-preview__portrait" src="/aura-assets/mood-confident-woman-art.png" alt="" width={220} height={170} />
        <Image className="auracue-share-preview__rose" src="/aura-assets/mood-romantic-rose-art.png" alt="" width={140} height={112} />
        <div className="auracue-share-preview__details">
          <span>Lucky color<br /><b>Blush Pink</b></span>
          <span>Soft, warm, and heart-opening</span>
          <span>Style vibe<br /><b>Soft Structure</b></span>
          <span>Flowy silhouettes with clean lines.</span>
          <span>Energy message<br /><b>Your calm is magnetic.</b></span>
          <span>Trust your pace. You&apos;re exactly where you need to be.</span>
          <span>Mini ritual<br /><b>Breathe in clarity, speak from heart.</b></span>
          <span>3 deep breaths. One present word. One aligned choice.</span>
        </div>
      </div>
    </article>
  );
}

export function buildShareUrl(cardId: string) {
  const path = `/share/${encodeURIComponent(cardId)}`;
  if (typeof window === "undefined") {
    return path;
  }
  return new URL(path, window.location.origin).toString();
}

export async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

export async function shareWithNativeWebApi(data: ShareData) {
  if (!navigator.share) {
    return false;
  }
  await navigator.share(data);
  return true;
}

export function triggerImageDownload(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
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
