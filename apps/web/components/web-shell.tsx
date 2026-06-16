import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

export type VisualReferenceId =
  | "home"
  | "context"
  | "upload"
  | "draw"
  | "reveal"
  | "result"
  | "activate"
  | "activated"
  | "share"
  | "share-channel"
  | "saved"
  | "error";

type WebShellProps = {
  title: string;
  eyebrow?: string | null;
  referenceId?: VisualReferenceId;
  children: ReactNode;
};

export function WebShell({ title, eyebrow = "AuraCue Web P0", referenceId, children }: WebShellProps) {
  const isHome = referenceId === "home";
  const isDraw = referenceId === "draw";
  const isActivated = referenceId === "activated";
  const hasBottomNav = isHome || isDraw || isActivated;
  const isDismissible = referenceId === "share" || referenceId === "saved";

  return (
    <main className="auracue-shell" data-reference-id={referenceId}>
      <div className="auracue-status-bar" aria-hidden="true">
        <span>9:41</span>
        <span className="auracue-status-icons">
          <i />
          <i />
          <i />
        </span>
      </div>
      <header className="auracue-shell__header">
        {isHome || isActivated ? (
          <span className="auracue-avatar">
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
        <Link href="/" className="auracue-shell__brand" aria-label="AuraCue home">
          <Image src="/aura-assets/common-brand-lotus.png" alt="" width={58} height={58} priority />
          <span>AuraCue</span>
        </Link>
        {isHome || isDraw || isActivated ? (
          <button className="auracue-gift-button" type="button" aria-label="Open gifts">
            <Image src="/aura-assets/common-header-gift.png" alt="" width={34} height={34} />
          </button>
        ) : (
          <span className="auracue-header-spacer" aria-hidden="true" />
        )}
      </header>
      <section className="auracue-shell__panel">
        {eyebrow ? <p className="auracue-shell__eyebrow">{eyebrow}</p> : null}
        {isActivated ? null : <h1>{title}</h1>}
        {children}
      </section>
      {hasBottomNav ? (
        <nav className="auracue-bottom-nav" aria-label="App tabs">
          <Link href="/" className="auracue-bottom-nav__item auracue-bottom-nav__item--active">
            <Image src="/aura-assets/common-tab-home.png" alt="" width={24} height={24} />
            <span>Home</span>
          </Link>
          <span className="auracue-bottom-nav__divider" aria-hidden="true" />
          <span className="auracue-bottom-nav__item">
            <Image src="/aura-assets/common-tab-profile.png" alt="" width={24} height={24} />
            <span>Profile</span>
          </span>
        </nav>
      ) : null}
    </main>
  );
}
