import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import useFetch from '../hooks/useFetch.js';
import { getCategories, getMonthly, getSummary } from '../services/dashboardService.js';
import { formatCurrency, formatDate, monthName } from '../utils/format.js';
import { CategoryDonut, PeriodBarChart, TrendLine } from '../components/Charts.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => Promise.all([getSummary(), getMonthly(6), getCategories()]), []);

  if (loading) return <Spinner label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const [summary, monthly, categories] = data;
  const income = Number(summary.totalIncome);
  const expenses = Number(summary.totalExpenses);
  const incomeShare = income + expenses > 0 ? (income / (income + expenses)) * 100 : 50;

  const budget = Number(summary.monthlyBudget);
  const spent = Number(summary.monthlyExpenses);
  const remaining = Number(summary.remainingBudget);
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  const remainingTone = budget === 0 ? '' : remaining < 0 ? 'expense' : percent >= 80 ? 'warn' : 'income';
  const month = monthName(summary.month);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hi, {user?.name?.split(' ')[0]}</h1>
          <p>Your money at a glance.</p>
        </div>
        <Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>
      </div>

      {budget > 0 && percent >= 80 && (
        <div className="alert alert-warn" role="alert" style={{ marginBottom: 16 }}>
          {percent >= 100
            ? `You are over your ${month} budget by ${formatCurrency(Math.abs(remaining))}.`
            : `You have used ${percent.toFixed(0)}% of your ${month} budget. ${formatCurrency(remaining)} left.`}
        </div>
      )}

      <section className="hero">
        <div className="card balance-card">
          <span className="label">Current balance</span>
          <span className="big num">{formatCurrency(summary.balance)}</span>
          <div className="split-bar" role="img" aria-label={`Income is ${incomeShare.toFixed(0)} percent of income plus expenses`}>
            <span className="in" style={{ width: `${incomeShare}%` }} />
            <span className="out" style={{ width: `${100 - incomeShare}%` }} />
          </div>
          <div className="legend"><span>Income {formatCurrency(income)}</span><span>Spent {formatCurrency(expenses)}</span></div>
        </div>
        <StatCard label="Total income" value={formatCurrency(income)} tone="income" />
        <StatCard label="Total expenses" value={formatCurrency(expenses)} tone="expense" />
      </section>

      <section className="insights">
        <StatCard label={`${month} budget`} value={budget > 0 ? formatCurrency(budget) : 'Not set'}
                  note={budget > 0 ? `${formatCurrency(spent)} spent` : <Link to="/budget">Set a budget</Link>} />
        <StatCard label="Remaining budget" value={budget > 0 ? formatCurrency(remaining) : '-'} tone={remainingTone}
                  note={budget > 0 ? `${Math.min(percent, 999).toFixed(0)}% used` : undefined} />
        <StatCard label="Top spending category" value={summary.highestSpendingCategory || '-'}
                  note={summary.highestSpendingCategory ? `${formatCurrency(summary.highestSpendingAmount)} in ${month}` : `No spending in ${month}`} />
        <StatCard label="Average daily expense" value={formatCurrency(summary.averageDailyExpense)} note={`${month} so far`} />
        <StatCard label="Transactions" value={summary.transactionCount} note="All time" />
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head"><h2>Income vs expenses</h2><span className="hint">Last 6 months</span></div>
          <div className="chart-box"><PeriodBarChart data={monthly} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Expenses by category</h2><span className="hint">{month}</span></div>
          <div className="chart-box">
            {categories.length ? <CategoryDonut data={categories} />
              : <EmptyState title="No expenses yet" message={`Nothing spent in ${month}.`} />}
          </div>
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head"><h2>Monthly expense trend</h2><span className="hint">Last 6 months</span></div>
          <div className="chart-box"><TrendLine data={monthly} /></div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Recent transactions</h2><Link to="/transactions">View all</Link></div>
          {summary.recentTransactions.length === 0 ? (
            <EmptyState title="No transactions yet" message="Add your first income or expense to get started."
                        action={<Link className="btn btn-primary" to="/transactions/new">Add transaction</Link>} />
          ) : (
            <ul className="recent">
              {summary.recentTransactions.map((t) => (
                <li key={t.id}>
                  <div>
                    <strong>{t.category}</strong>
                    <div className="meta">{formatDate(t.date)}{t.description ? ` - ${t.description}` : ''}</div>
                  </div>
                  <strong className={`amt num ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
