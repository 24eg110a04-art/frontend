import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmDialog open={false} title="t" message="m" onConfirm={() => {}} onCancel={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onConfirm and onCancel', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ConfirmDialog open title="Delete this transaction?" message="Cannot be undone" onConfirm={onConfirm} onCancel={onCancel} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
