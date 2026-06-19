import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export type VisualReferenceId =
  | "home"
  | "context"
  | "birthday"
  | "birth-aura"
  | "upload"
  | "draw"
  | "reading"
  | "reveal"
  | "result"
  | "activate"
  | "activated"
  | "share"
  | "share-channel"
  | "saved"
  | "my"
  | "error";

type WebShellProps = {
  title: string;
  eyebrow?: string | null;
  referenceId?: VisualReferenceId;
  children: ReactNode;
};

const bottomNavPages: VisualReferenceId[] = ["home", "context", "birthday", "birth-aura", "upload", "draw", "reading", "result", "activate", "activated", "share", "saved", "my", "error"];

export function WebShell({ title, eyebrow = "AuraCue", referenceId = "home", children }: WebShellProps) {
  const isHome = referenceId === "home";
  const isMy = referenceId === "my";
  const isDraw = referenceId === "draw";
  const isActivated = referenceId === "activated";
  const isDismissible = referenceId === "share" || referenceId === "saved" || referenceId === "share-channel";
  const showBottomNav = bottomNavPages.includes(referenceId);
  const showAvatar = isHome || isMy || isActivated;
  const showRightAction = isHome || isDraw || isActivated || isMy;

  return (
    <main className="auracue-shell aura-replica-shell" data-reference-id={referenceId}>
      <div className="auracue-status-bar" aria-hidden="true">
        <span>9:41</span>
        <span className="auracue-status-icons">
          <i />
          <i />
          <i />
        </span>
      </div>
      <header className="auracue-shell__header aura-replica-header">
        {showAvatar ? (
          <span className="auracue-avatar aura-replica-avatar">
            <Image src="/aura-assets/common-header-avatar.png" alt="" width={72} height={72} priority />
          </span>
        ) : isDraw ? (
          <span className="auracue-draw-spark-button" aria-hidden="true">
            <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={28} height={28} />
          </span>
        ) : (
          <Link className="auracue-back-button" href="/" aria-label="Back to home">
            <Image src={isDismissible ? "/aura-assets/share-nav-close.png" : "/aura-assets/context-nav-back.png"} alt="" width={34} height={34} />
          </Link>
        )}
        <Link href="/" className="auracue-shell__brand aura-replica-brand" aria-label="AuraCue home">
          <Image src="/aura-assets/common-brand-lotus.png" alt="" width={58} height={58} priority />
          <span>AuraCue</span>
        </Link>
        {showRightAction ? (
          <Link className="auracue-gift-button" href={isMy ? "/" : "/my"} aria-label={isMy ? "Back home" : "Open My Aura"}>
            <Image src={isMy ? "/aura-assets/common-tab-home.png" : isHome ? "/aura-assets/common-header-gift.png" : "/aura-assets/common-tab-profile.png"} alt="" width={30} height={30} />
          </Link>
        ) : (
          <span className="auracue-header-spacer" aria-hidden="true" />
        )}
      </header>
      <section className="auracue-shell__panel aura-replica-panel">
        {eyebrow ? <p className="auracue-shell__eyebrow aura-replica-eyebrow">{eyebrow}</p> : null}
        {isActivated ? null : <h1>{title}</h1>}
        {children}
      </section>
      {showBottomNav ? (
        <nav className="auracue-bottom-nav aura-replica-bottom-nav" aria-label="App tabs">
          <Link href="/" className={`auracue-bottom-nav__item ${isMy ? "" : "auracue-bottom-nav__item--active"}`}>
            <Image src="/aura-assets/common-tab-home.png" alt="" width={24} height={24} />
            <span>Home</span>
          </Link>
          <span className="auracue-bottom-nav__divider" aria-hidden="true" />
          <Link href="/my" className={`auracue-bottom-nav__item ${isMy ? "auracue-bottom-nav__item--active" : ""}`}>
            <Image src="/aura-assets/common-tab-profile.png" alt="" width={24} height={24} />
            <span>My</span>
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
