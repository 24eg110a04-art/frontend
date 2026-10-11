export default function ErrorState({ message, onRetry }) {
  return (
    <div className="center-block" role="alert">
      <div className="alert alert-error">{message || 'Something went wrong.'}</div>
      {onRetry && <button className="btn btn-ghost" onClick={onRetry}>Try again</button>}
    </div>
  );
}
