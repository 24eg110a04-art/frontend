import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatCard from '../components/StatCard.jsx';

describe('StatCard', () => {
  it('shows the label, value and note', () => {
    render(<StatCard label="Total income" value="₹5,000.00" note="All time" tone="income" />);
    expect(screen.getByText('Total income')).toBeInTheDocument();
    expect(screen.getByText('₹5,000.00')).toHaveClass('income');
    expect(screen.getByText('All time')).toBeInTheDocument();
  });
});
