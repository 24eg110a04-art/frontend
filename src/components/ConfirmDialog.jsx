import { useEffect } from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title">{title}</h2>
        <p>{message}</p>
        <div className="btns">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? <span className="spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
