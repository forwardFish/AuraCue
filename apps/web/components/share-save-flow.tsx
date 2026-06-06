"use client";

import Link from "next/link";
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
    <WebShell title="Share your AuraCue." eyebrow="Share" referenceId="share">
      <div className="auracue-flow">
        {status === "loading" ? <LoadingState title="Preparing share image" message="Rendering a 9:16 AuraCue preview." /> : null}
        {status === "error" ? <ErrorState title="Share unavailable" message={message ?? "Share page could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <SharePreview card={card} shareImageUrl={shareImageUrl} fallback={renderFallback} />
            {renderFallback ? (
              <div className="auracue-inline-state auracue-inline-state--error" role="alert">
                Render failed. You can still copy the link or generate again.
              </div>
            ) : null}
            {message ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
            <div className="auracue-flow__actions auracue-flow__actions--stack">
              <button className="auracue-secondary-action" type="button" onClick={copyLink} disabled={actionStatus !== "idle"}>
                {actionStatus === "copying" ? "Copying..." : "Copy Link"}
              </button>
              <button className="auracue-secondary-action" type="button" onClick={shareCard} disabled={actionStatus !== "idle"}>
                {actionStatus === "sharing" ? "Sharing..." : "Share"}
              </button>
              <button className="auracue-secondary-action" type="button" onClick={saveImage} disabled={actionStatus !== "idle"}>
                {actionStatus === "downloading" ? "Saving..." : "Save Image"}
              </button>
              <button className="auracue-primary-action" type="button" onClick={saveToCollection} disabled={actionStatus !== "idle"}>
                {actionStatus === "saving" ? "Saving..." : "Save to AuraCue"}
              </button>
              <Link className="auracue-secondary-action auracue-link-action" href="/">
                Generate Again
              </Link>
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
    <WebShell title="Saved to AuraCue." eyebrow="Saved" referenceId="saved">
      <div className="auracue-flow">
        {status === "loading" ? <LoadingState title="Confirming save" message="Checking the saved card details." /> : null}
        {status === "error" ? <ErrorState title="Saved card unavailable" message={message ?? "Saved card could not be loaded."} onRetry={() => window.location.reload()} /> : null}
        {card ? (
          <>
            <div className="auracue-saved-card" role="status">
              <span>Saved</span>
              <strong>{card.content?.auraName ?? card.content?.title ?? "Today's aura"}</strong>
              <p>{card.isActivated ? "Your activated aura is ready to revisit." : "Your aura card is saved for this session."}</p>
            </div>
            {message ? <div className="auracue-inline-state auracue-inline-state--success">{message}</div> : null}
            <div className="auracue-flow__actions">
              <button className="auracue-secondary-action" type="button" onClick={copySavedLink}>
                Copy Link
              </button>
              <Link className="auracue-secondary-action auracue-link-action" href={`/share/${cardId}`}>
                Share Again
              </Link>
              <Link className="auracue-primary-action auracue-link-action" href="/">
                Back Home
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </WebShell>
  );
}

function SharePreview({ card, shareImageUrl, fallback }: { card: AuraCard; shareImageUrl: string | null; fallback: boolean }) {
  const content = card.content ?? {};
  return (
    <article className="auracue-share-preview" aria-label="9:16 share image preview" data-render-fallback={fallback ? "true" : "false"}>
      <div className="auracue-share-preview__image">
        {shareImageUrl ? <span>{shareImageUrl}</span> : <span>Fallback preview</span>}
        <strong>{content.auraName ?? content.title ?? "AuraCue Card"}</strong>
        <p>{content.shareCaption ?? content.energyMessage ?? "Carry this cue through today."}</p>
      </div>
      <dl>
        <div>
          <dt>Aspect</dt>
          <dd>9:16</dd>
        </div>
        <div>
          <dt>Lucky color</dt>
          <dd>{content.luckyColor ?? "today's cue"}</dd>
        </div>
        <div>
          <dt>Activated</dt>
          <dd>{card.isActivated ? "Yes" : "Not yet"}</dd>
        </div>
      </dl>
      <p className="auracue-flow__safe">
        {content.safetyDisclaimer ?? "For reflection and fun. Not a guarantee or professional advice."}
      </p>
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
