import Link from "next/link";
import { WebShell } from "./web-shell";

type RoutePlaceholderProps = {
  title: string;
  route: string;
  routeId?: string;
  uiId?: string;
  nextHref?: string;
};

export function RoutePlaceholder({
  title,
  route,
  routeId,
  uiId,
  nextHref
}: RoutePlaceholderProps) {
  return (
    <WebShell title={title}>
      <div className="auracue-placeholder">
        <p>
          Shell placeholder for <code>{route}</code>. Business flow, API data,
          and final UI are intentionally left for later page tasks.
        </p>
        <dl>
          {routeId ? (
            <>
              <dt>Route ID</dt>
              <dd>{routeId}</dd>
            </>
          ) : null}
          {uiId ? (
            <>
              <dt>UI target</dt>
              <dd>{uiId}</dd>
            </>
          ) : null}
        </dl>
        <nav className="auracue-placeholder__actions">
          <Link href="/" className="rounded-full border border-auracue-gold/40 px-4 py-3">
            Home
          </Link>
          {nextHref ? (
            <Link
              href={nextHref}
              className="rounded-full bg-auracue-coral px-4 py-3 text-white"
            >
              Next
            </Link>
          ) : null}
        </nav>
      </div>
    </WebShell>
  );
}
