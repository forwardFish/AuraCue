import Link from "next/link";
import Image from "next/image";
import { WebShell } from "@/components/web-shell";

export default function RetryPage() {
  return (
    <WebShell title="Try again" eyebrow="Oracle paused" referenceId="error">
      <div className="auracue-flow auracue-flow--retry">
        <div className="auracue-activated-star" aria-hidden="true">
          <Image src="/aura-assets/common-sparkle-gold.png" alt="" width={42} height={42} />
        </div>
        <div className="auracue-state auracue-state--error" role="status">
          <div>
            <h2>The reading was interrupted</h2>
            <p>Your selections are safe. Return to the card draw and continue the ritual.</p>
          </div>
          <div className="auracue-state__actions">
            <Link href="/create/draw">Draw again</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </div>
    </WebShell>
  );
}
