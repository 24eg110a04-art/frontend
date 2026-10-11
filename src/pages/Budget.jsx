import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Icon from '../components/Icon.jsx';
import Spinner from '../components/Spinner.jsx';
import useFetch from '../hooks/useFetch.js';
import { createBudget, deleteBudget, getBudgets, updateBudget } from '../services/budgetService.js';
import { MONTH_NAMES } from '../utils/constants.js';
import { formatCurrency, monthName } from '../utils/format.js';
import { validateAmount } from '../utils/validators.js';

const now = new Date();
const blankForm = () => ({ month: now.getMonth() + 1, year: now.getFullYear(), amount: '' });

function statusOf(percent) {
  if (percent >= 100) return { cls: 'over', label: 'Over budget' };
  if (percent >= 80) return { cls: 'warn', label: 'Approaching limit' };
  return { cls: '', label: 'On track' };
}

export default function Budget() {
  const { data: budgets, loading, error, reload } = useFetch(getBudgets, []);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [amountError, setAmountError] = useState('');
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const resetForm = () => {
    setForm(blankForm());
    setEditingId(null);
    setAmountError('');
    setServerError('');
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setForm({ month: b.month, year: b.year, amount: String(b.amount) });
    setAmountError('');
    setServerError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validateAmount(form.amount, 'Budget amount');
    setAmountError(problem);
    setServerError('');
    if (problem) return;
    const payload = { month: Number(form.month), year: Number(form.year), amount: Number(form.amount) };
    setSaving(true);
    try {
      if (editingId) {
        await updateBudget(editingId, payload);
        toast.success('Budget updated');
      } else {
        await createBudget(payload);
        toast.success('Budget created');
      }
      resetForm();
      reload();
    } catch (err) {
      setServerError(err.userMessage || 'Could not save the budget');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteBudget(toDelete.id);
      toast.success('Budget deleted');
      if (editingId === toDelete.id) resetForm();
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(err.userMessage || 'Could not delete the budget');
    } finally {
      setDeleting(false);
    }
  };

  const current = budgets?.find((b) => b.month === now.getMonth() + 1 && b.year === now.getFullYear());
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Budget</h1>
          <p>Set a spending limit for each month and watch your progress.</p>
        </div>
      </div>

      {current && current.percentUsed >= 80 && (
        <div className="alert alert-warn" role="alert" style={{ marginBottom: 16 }}>
          {current.percentUsed >= 100
            ? `You have gone over your ${monthName(current.month)} budget by ${formatCurrency(Math.abs(current.remaining))}.`
            : `You have used ${current.percentUsed.toFixed(0)}% of your ${monthName(current.month)} budget. Only ${formatCurrency(current.remaining)} left.`}
        </div>
      )}

      <div className="card" style={{ maxWidth: 720, marginBottom: 20 }}>
        <div className="card-head"><h2>{editingId ? 'Update budget' : 'Create a monthly budget'}</h2></div>
        {serverError && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{serverError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <div className="field">
              <label htmlFor="b-month">Month</label>
              <select id="b-month" className="select" value={form.month} disabled={Boolean(editingId)}
                      onChange={(e) => setForm({ ...form, month: e.target.value })}>
                {MONTH_NAMES.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="b-year">Year</label>
              <select id="b-year" className="select" value={form.year} disabled={Boolean(editingId)}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}>
                {[...new Set([...years, Number(form.year)])].sort((a, b) => a - b).map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className={`field ${amountError ? 'invalid' : ''}`}>
              <label htmlFor="b-amount">Budget amount</label>
              <input id="b-amount" className="input num" type="number" step="0.01" min="0" placeholder="0.00"
                     value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              {amountError && <span className="field-error">{amountError}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? <span className="spinner" /> : editingId ? 'Save budget' : 'Create budget'}
            </button>
            {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm} disabled={saving}>Cancel</button>}
          </div>
        </form>
      </div>

      {loading && <Spinner label="Loading budgets..." />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && budgets.length === 0 && (
        <div className="card"><EmptyState title="No budgets yet" message="Create your first monthly budget above." /></div>
      )}
      {!loading && !error && budgets.length > 0 && (
        <div className="budget-list">
          {budgets.map((b) => {
            const status = statusOf(b.percentUsed);
            return (
              <div className="card budget-item" key={b.id}>
                <div className="top">
                  <div>
                    <h2>{monthName(b.month)} {b.year}</h2>
                    <span className={`badge ${status.cls === 'over' ? 'expense' : status.cls === 'warn' ? '' : 'income'}`}
                          style={status.cls === 'warn' ? { background: 'var(--marigold-bg)', color: '#8a5b00' } : undefined}>
                      {status.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-icon" aria-label={`Edit ${monthName(b.month)} ${b.year} budget`} onClick={() => startEdit(b)}><Icon name="edit" /></button>
                    <button className="btn btn-ghost btn-icon" aria-label={`Delete ${monthName(b.month)} ${b.year} budget`} onClick={() => setToDelete(b)}><Icon name="trash" /></button>
                  </div>
                </div>
                <div className={`progress ${status.cls}`} role="progressbar" aria-valuemin={0} aria-valuemax={100}
                     aria-valuenow={Math.min(Math.round(b.percentUsed), 100)} aria-label="Budget used">
                  <span style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                </div>
                <div className="nums num">
                  <span>Budget<strong>{formatCurrency(b.amount)}</strong></span>
                  <span>Used ({b.percentUsed.toFixed(0)}%)<strong>{formatCurrency(b.used)}</strong></span>
                  <span>{b.remaining < 0 ? 'Over by' : 'Remaining'}<strong style={{ color: b.remaining < 0 ? 'var(--expense)' : undefined }}>{formatCurrency(Math.abs(b.remaining))}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this budget?"
        message={toDelete ? `The ${monthName(toDelete.month)} ${toDelete.year} budget of ${formatCurrency(toDelete.amount)} will be removed. Your transactions are not affected.` : ''}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </>
  );
}
