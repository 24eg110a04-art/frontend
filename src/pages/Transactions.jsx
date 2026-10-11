import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Icon from '../components/Icon.jsx';
import Pagination from '../components/Pagination.jsx';
import Spinner from '../components/Spinner.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';
import { deleteTransaction, getTransactions } from '../services/transactionService.js';
import { ALL_CATEGORIES } from '../utils/constants.js';
import { formatCurrency, formatDate } from '../utils/format.js';

const PAGE_SIZE = 10;

export default function Transactions() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', type: '', category: '', from: '', to: '' });
  const [page, setPage] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 400);

  const { data, loading, error, reload } = useFetch(
    () => getTransactions({ ...filters, search: debouncedSearch.trim(), page, size: PAGE_SIZE }),
    [debouncedSearch, filters.type, filters.category, filters.from, filters.to, page]);

  const setFilter = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(0);
  };

  const hasFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => {
    setFilters({ search: '', type: '', category: '', from: '', to: '' });
    setPage(0);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(toDelete.id);
      toast.success('Transaction deleted');
      setToDelete(null);
      if (data.content.length === 1 && page > 0) setPage(page - 1);
      else reload();
    } catch (err) {
      toast.error(err.userMessage || 'Could not delete the transaction');
    } finally {
      setDeleting(false);
    }
  };

  const sign = (t) => (t.type === 'INCOME' ? '+' : '-');
  const tone = (t) => (t.type === 'INCOME' ? 'income' : 'expense');
  const actions = (t) => (
    <div className="actions">
      <button className="btn btn-ghost btn-icon" aria-label={`Edit ${t.category} transaction`} onClick={() => navigate(`/transactions/${t.id}/edit`)}><Icon name="edit" /></button>
      <button className="btn btn-ghost btn-icon" aria-label={`Delete ${t.category} transaction`} onClick={() => setToDelete(t)}><Icon name="trash" /></button>
    </div>
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Transactions</h1>
          <p>Search, filter and manage everything you have recorded.</p>
        </div>
        <Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>
      </div>

      <div className="card">
        <div className="filters">
          <div className="field">
            <label htmlFor="f-search">Search</label>
            <input id="f-search" className="input" placeholder="Description, category or payment method"
                   value={filters.search} onChange={setFilter('search')} />
          </div>
          <div className="field">
            <label htmlFor="f-type">Type</label>
            <select id="f-type" className="select" value={filters.type} onChange={setFilter('type')}>
              <option value="">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-category">Category</label>
            <select id="f-category" className="select" value={filters.category} onChange={setFilter('category')}>
              <option value="">All categories</option>
              {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-from">From</label>
            <input id="f-from" className="input" type="date" value={filters.from} max={filters.to || undefined} onChange={setFilter('from')} />
          </div>
          <div className="field">
            <label htmlFor="f-to">To</label>
            <input id="f-to" className="input" type="date" value={filters.to} min={filters.from || undefined} onChange={setFilter('to')} />
          </div>
        </div>
        {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ marginBottom: 12 }}>Clear filters</button>}

        {loading && <Spinner label="Loading transactions..." />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && data.content.length === 0 && (
          hasFilters
            ? <EmptyState title="No matching transactions" message="Try changing or clearing your filters." />
            : <EmptyState title="No transactions yet" message="Add your first income or expense to see it here."
                          action={<Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>} />
        )}

        {!loading && !error && data.content.length > 0 && (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th><th>Type</th><th>Category</th><th className="right">Amount</th>
                    <th>Payment method</th><th>Description</th><th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((t) => (
                    <tr key={t.id}>
                      <td className="num" style={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                      <td><span className={`badge ${tone(t)}`}>{t.type === 'INCOME' ? 'Income' : 'Expense'}</span></td>
                      <td>{t.category}</td>
                      <td className={`right amt num ${tone(t)}`}><strong>{sign(t)}{formatCurrency(t.amount)}</strong></td>
                      <td>{t.paymentMethod || '-'}</td>
                      <td className="desc" title={t.description || ''}>{t.description || '-'}</td>
                      <td>{actions(t)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tx-cards">
              {data.content.map((t) => (
                <div className="tx-card" key={t.id}>
                  <div className="row">
                    <strong>{t.category}</strong>
                    <strong className={`amt num ${tone(t)}`}>{sign(t)}{formatCurrency(t.amount)}</strong>
                  </div>
                  <div className="row">
                    <span className="num" style={{ color: 'var(--muted)' }}>{formatDate(t.date)} - {t.paymentMethod || 'N/A'}</span>
                    <span className={`badge ${tone(t)}`}>{t.type === 'INCOME' ? 'Income' : 'Expense'}</span>
                  </div>
                  {t.description && <span style={{ color: 'var(--muted)' }}>{t.description}</span>}
                  {actions(t)}
                </div>
              ))}
            </div>

            <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements}
                        size={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this transaction?"
        message={toDelete ? `${toDelete.category} - ${formatCurrency(toDelete.amount)} on ${formatDate(toDelete.date)}. This cannot be undone.` : ''}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setToDelete(null)}
      />
    </>
  );
}
