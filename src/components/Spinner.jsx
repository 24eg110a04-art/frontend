export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="center-block" role="status">
      <span className="spinner dark big" />
      <span>{label}</span>
    </div>
  );
}
