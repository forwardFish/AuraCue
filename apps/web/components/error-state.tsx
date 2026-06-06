"use client";

import Link from "next/link";

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  homeHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Retry",
  onRetry,
  homeHref = "/"
}: ErrorStateProps) {
  return (
    <div className="auracue-state auracue-state--error" role="alert">
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      <div className="auracue-state__actions">
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            {retryLabel}
          </button>
        ) : null}
        <Link href={homeHref}>Home</Link>
      </div>
    </div>
  );
}
