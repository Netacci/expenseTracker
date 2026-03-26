/* eslint-disable react/prop-types */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#3b82f6', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-white rounded-xl shadow-lg border border-slate-100 p-3'>
        {label && <p className='text-xs font-semibold text-slate-600 mb-2'>{label}</p>}
        {payload.map((entry) => (
          <div key={entry.name} className='flex items-center gap-2 text-sm'>
            <div className='w-2 h-2 rounded-full' style={{ backgroundColor: entry.color }} />
            <span className='text-slate-600'>{entry.name}:</span>
            <span className='text-slate-900 font-bold'>
              {Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BudgetChart = ({ getIncomeVsExpensesData, getChartData }) => {
  const pieData = getIncomeVsExpensesData();
  const barData = getChartData()?.map((item) => ({
    ...item,
    name: item.name.length > 10 ? item.name.slice(0, 10) + '…' : item.name,
  }));

  return (
    <div className='grid gap-4 md:grid-cols-2 mb-6'>
      <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
        <div className='mb-4'>
          <h3 className='text-base font-bold text-slate-900'>Income vs Expenses</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Budget cash flow breakdown</p>
        </div>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className='text-xs font-medium text-slate-600'>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='bg-white rounded-2xl border border-slate-100 shadow-card p-5'>
        <div className='mb-4'>
          <h3 className='text-base font-bold text-slate-900'>Category Breakdown</h3>
          <p className='text-xs text-slate-400 mt-0.5'>Budget vs actual per category</p>
        </div>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData} barSize={10}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' vertical={false} />
              <XAxis
                dataKey='name'
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className='text-xs font-medium text-slate-600'>{value}</span>
                )}
              />
              <Bar dataKey='budget' name='Budget' fill='#a78bfa' radius={[4, 4, 0, 0]} />
              <Bar dataKey='spent' name='Spent' fill='#f43f5e' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;
