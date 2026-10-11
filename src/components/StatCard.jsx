export default function StatCard({ label, value, note, tone }) {
  return (
    <div className="card stat">
      <span className="label">{label}</span>
      <span className={`value num ${tone || ''}`}>{value}</span>
      {note && <span className="note">{note}</span>}
    </div>
  );
}
