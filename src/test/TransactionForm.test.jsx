import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TransactionForm from '../components/TransactionForm.jsx';

describe('TransactionForm', () => {
  it('shows validation messages and does not submit an empty form', async () => {
    const onSubmit = vi.fn();
    render(<TransactionForm submitLabel="Add transaction" onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add transaction' }));
    expect(await screen.findByText('Amount is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid transaction', async () => {
    const onSubmit = vi.fn();
    render(<TransactionForm submitLabel="Add transaction" onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText('Amount'), '250.5');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food');
    await userEvent.click(screen.getByRole('button', { name: 'Add transaction' }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ type: 'EXPENSE', amount: 250.5, category: 'Food' }));
  });

  it('switches category list when the type changes', async () => {
    render(<TransactionForm submitLabel="Save" onSubmit={() => {}} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Income' }));
    expect(screen.getByRole('option', { name: 'Salary' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Rent' })).not.toBeInTheDocument();
  });
});
