export default function DataLoading() {
  return (
    <div className="data-loading" role="status" aria-live="polite">
      <span className="eyebrow">GETTING THE DETAILS</span>
      <p>Loading the latest available information…</p>
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  );
}
