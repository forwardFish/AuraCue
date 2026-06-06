type LoadingStateProps = {
  title?: string;
  message?: string;
};

export function LoadingState({
  title = "Loading",
  message = "Preparing the next AuraCue step."
}: LoadingStateProps) {
  return (
    <div className="auracue-state" role="status" aria-live="polite">
      <span className="auracue-state__spinner" aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
