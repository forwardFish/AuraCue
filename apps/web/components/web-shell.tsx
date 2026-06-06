import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { auraCueRoutes } from "@/lib/routes";

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
  eyebrow?: string;
  referenceId?: VisualReferenceId;
  children: ReactNode;
};

export function WebShell({ title, eyebrow = "AuraCue Web P0", referenceId, children }: WebShellProps) {
  const referenceSrc = referenceId ? `/ui-reference/${referenceId}.png` : null;
  const shell = (
    <>
      <header className="auracue-shell__header">
        <Link href="/" className="auracue-shell__brand" aria-label="AuraCue home">
          AuraCue
        </Link>
        <nav className="auracue-shell__route-nav" aria-label="P0 routes">
          {auraCueRoutes.slice(0, 4).map((route) => (
            <Link key={route.id} href={route.path}>
              {route.label}
            </Link>
          ))}
        </nav>
      </header>
      <section className="auracue-shell__panel">
        <p className="auracue-shell__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </section>
    </>
  );

  if (referenceSrc) {
    return (
      <main className="auracue-shell auracue-shell--reference" data-reference-id={referenceId}>
        <div className="auracue-reference-stage">
          <Image className="auracue-reference-image" src={referenceSrc} alt="" width={941} height={1672} priority aria-hidden="true" />
          <div className="auracue-reference-interactions" aria-label={`${title} interaction layer`}>
            {shell}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auracue-shell">
      {shell}
    </main>
  );
}
