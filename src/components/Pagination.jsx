export default function Pagination({ page, totalPages, totalElements, size, onChange }) {
  if (!totalElements) return null;
  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);
  return (
    <div className="pager">
      <span>Showing {from}-{to} of {totalElements}</span>
      <div className="btns">
        <button className="btn btn-ghost btn-sm" disabled={page <= 0} onClick={() => onChange(page - 1)}>Previous</button>
        <span style={{ alignSelf: 'center' }}>Page {page + 1} of {Math.max(totalPages, 1)}</span>
        <button className="btn btn-ghost btn-sm" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}
