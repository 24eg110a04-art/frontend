import { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/constants.js';
import { todayISO } from '../utils/format.js';
import { hasErrors, validateAmount, validateDate } from '../utils/validators.js';

function validate(values) {
  return {
    amount: validateAmount(values.amount),
    category: values.category ? '' : 'Category is required',
    date: validateDate(values.date),
    description: values.description.length > 255 ? 'Description must be at most 255 characters' : '',
  };
}

export default function TransactionForm({ initial, submitLabel, submitting, serverError, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    type: initial?.type || 'EXPENSE',
    amount: initial?.amount ?? '',
    category: initial?.category || '',
    date: initial?.date || todayISO(),
    paymentMethod: initial?.paymentMethod || 'Cash',
    description: initial?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const categories = values.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = values.category && !categories.includes(values.category)
    ? [values.category, ...categories] : categories;

  const update = (field, value) => {
    const next = { ...values, [field]: value };
    if (field === 'type') next.category = '';
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const found = validate(values);
    setErrors(found);
    if (hasErrors(found)) return;
    onSubmit({
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
      paymentMethod: values.paymentMethod,
      description: values.description.trim(),
    });
  };

  const fieldClass = (name) => `field ${errors[name] ? 'invalid' : ''}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>{serverError}</div>}
      <div className="form-grid">
        <div className="field span-2">
          <label id="type-label">Transaction type</label>
          <div className="segmented" role="group" aria-labelledby="type-label">
            <button type="button" className={`${values.type === 'INCOME' ? 'on income' : ''}`} onClick={() => update('type', 'INCOME')}>Income</button>
            <button type="button" className={`${values.type === 'EXPENSE' ? 'on expense' : ''}`} onClick={() => update('type', 'EXPENSE')}>Expense</button>
          </div>
        </div>

        <div className={fieldClass('amount')}>
          <label htmlFor="amount">Amount</label>
          <input id="amount" className="input num" type="number" inputMode="decimal" step="0.01" min="0"
                 placeholder="0.00" value={values.amount} onChange={(e) => update('amount', e.target.value)} />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div className={fieldClass('category')}>
          <label htmlFor="category">Category</label>
          <select id="category" className="select" value={values.category} onChange={(e) => update('category', e.target.value)}>
            <option value="">Select a category</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className={fieldClass('date')}>
          <label htmlFor="date">Date</label>
          <input id="date" className="input" type="date" value={values.date} onChange={(e) => update('date', e.target.value)} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>

        <div className="field">
          <label htmlFor="paymentMethod">Payment method</label>
          <select id="paymentMethod" className="select" value={values.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className={`${fieldClass('description')} span-2`}>
          <label htmlFor="description">Description <span style={{ color: 'var(--muted)', fontWeight: 500 }}>(optional)</span></label>
          <textarea id="description" className="textarea" maxLength={300} value={values.description}
                    placeholder="What was this for?" onChange={(e) => update('description', e.target.value)} />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? <span className="spinner" /> : submitLabel}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>Cancel</button>
      </div>
    </form>
  );
}
