import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { CHART_COLORS } from '../utils/constants.js';
import { formatCompact, formatCurrency } from '../utils/format.js';

const axisProps = { tickLine: false, axisLine: false, fontSize: 12, stroke: '#5e7069' };
const money = (value) => formatCurrency(value);

/** Grouped bars of income and/or expense per period. `data` items: { label, income, expense } */
export function PeriodBarChart({ data, showIncome = true, showExpense = true, tickFormatter }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce5e2" />
        <XAxis dataKey="label" tickFormatter={tickFormatter} {...axisProps} />
        <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
        <Tooltip formatter={money} labelFormatter={tickFormatter} />
        {showIncome && showExpense && <Legend />}
        {showIncome && <Bar dataKey="income" name="Income" fill="#14876b" radius={[4, 4, 0, 0]} />}
        {showExpense && <Bar dataKey="expense" name="Expenses" fill="#d9482b" radius={[4, 4, 0, 0]} />}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({ data, tickFormatter }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce5e2" />
        <XAxis dataKey="label" tickFormatter={tickFormatter} {...axisProps} />
        <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
        <Tooltip formatter={money} labelFormatter={tickFormatter} />
        <Line type="monotone" dataKey="expense" name="Expenses" stroke="#e8a220" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Doughnut chart. `data` items: { category, total } */
export function CategoryDonut({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
          {data.map((entry, i) => <Cell key={entry.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={money} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
