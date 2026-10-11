import { useState } from 'react';
import { CategoryDonut, PeriodBarChart } from '../components/Charts.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';
import useFetch from '../hooks/useFetch.js';
import { getCategoryReport, getDaily, getMonthly, getWeekly } from '../services/reportService.js';
import { CHART_COLORS } from '../utils/constants.js';
import { formatCurrency, formatShortDate } from '../utils/format.js';

const TABS = [
  { key: 'daily', label: 'Daily', unit: 'days', options: [7, 14, 30], initial: 14 },
  { key: 'weekly', label: 'Weekly', unit: 'weeks', options: [4, 8, 12], initial: 8 },
  { key: 'monthly', label: 'Monthly', unit: 'months', options: [6, 12, 24], initial: 12 },
  { key: 'category', label: 'By category' },
  { key: 'compare', label: 'Income vs expenses', unit: 'months', options: [6, 12, 24], initial: 12 },
];

function load(tab, range, categoryType) {
  if (tab === 'daily') return getDaily(range);
  if (tab === 'weekly') return getWeekly(range);
  if (tab === 'category') return getCategoryReport(categoryType);
  return getMonthly(range); // monthly + compare
}

const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key]), 0);

export default function Reports() {
  const [tab, setTab] = useState('daily');
  const [range, setRange] = useState(14);
  const [categoryType, setCategoryType] = useState('EXPENSE');
  const active = TABS.find((t) => t.key === tab);

  const { data, loading, error, reload } = useFetch(() => load(tab, range, categoryType), [tab, range, categoryType]);

  const selectTab = (t) => {
    setTab(t.key);
    if (t.initial) setRange(t.initial);
  };

  const tickFormatter = tab === 'daily' || tab === 'weekly' ? formatShortDate : undefined;
  const weekPrefix = tab === 'weekly' ? 'Week of ' : '';

  const renderBody = () => {
    if (loading) return <Spinner label="Building report..." />;
    if (error) return <ErrorState message={error} onRetry={reload} />;

    if (tab === 'category') {
      if (data.length === 0) {
        return <EmptyState title="Nothing to show" message={`No ${categoryType === 'EXPENSE' ? 'expenses' : 'income'} recorded yet.`} />;
      }
      return (
        <div className="grid-2" style={{ marginBottom: 0 }}>
          <div className="chart-box tall"><CategoryDonut data={data} /></div>
          <ul className="rank">
            {data.map((row, i) => (
              <li key={row.category}>
                <div className="line">
                  <span><span className="swatch" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />{row.category}</span>
                  <span className="num">{formatCurrency(row.total)} ({row.percentage.toFixed(1)}%)</span>
                </div>
                <div className="progress"><span style={{ width: `${row.percentage}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} /></div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const totalExpense = sum(data, 'expense');
    const totalIncome = sum(data, 'income');
    const showIncome = tab === 'compare';
    const hasData = totalExpense > 0 || totalIncome > 0;

    return (
      <>
        <div className="summary-strip">
          {showIncome && <StatCard label="Income" value={formatCurrency(totalIncome)} tone="income" />}
          <StatCard label="Expenses" value={formatCurrency(totalExpense)} tone="expense" />
          {showIncome
            ? <StatCard label="Net" value={formatCurrency(totalIncome - totalExpense)} tone={totalIncome >= totalExpense ? 'income' : 'expense'} />
            : <StatCard label={`Average per ${active.unit.slice(0, -1)}`} value={formatCurrency(totalExpense / data.length)} />}
        </div>
        {hasData ? (
          <div className="chart-box tall">
            <PeriodBarChart data={data} showIncome={showIncome} tickFormatter={(v) => (tickFormatter ? `${weekPrefix}${tickFormatter(v)}` : v)} />
          </div>
        ) : (
          <EmptyState title="No activity in this period" message="Try a longer range or add some transactions." />
        )}
      </>
    );
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p>See how your spending and income change over time.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="segmented" role="tablist">
            {TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'on' : ''} onClick={() => selectTab(t)}>
                {t.label}
              </button>
            ))}
          </div>
          {active.options && (
            <div className="field" style={{ minWidth: 150 }}>
              <label htmlFor="range" className="hint">Range</label>
              <select id="range" className="select" value={range} onChange={(e) => setRange(Number(e.target.value))}>
                {active.options.map((n) => <option key={n} value={n}>Last {n} {active.unit}</option>)}
              </select>
            </div>
          )}
          {tab === 'category' && (
            <div className="segmented">
              <button className={categoryType === 'EXPENSE' ? 'on expense' : ''} onClick={() => setCategoryType('EXPENSE')}>Expenses</button>
              <button className={categoryType === 'INCOME' ? 'on income' : ''} onClick={() => setCategoryType('INCOME')}>Income</button>
            </div>
          )}
        </div>
        {renderBody()}
      </div>
    </>
  );
}
