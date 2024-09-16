/* eslint-disable react/prop-types */
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Tooltipp from '../../../components/tooltip/Tooltip';

const Charts = ({ totalExpenses, totalIncome, budgets }) => {
  const pieChartData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  const barChartData = budgets?.map((budget) => ({
    name: budget.name,
    Spent: budget.total_expenses,
    Remaining: budget.balance,
  }));

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card>
        <CardHeader className='flex  items-center flex-row space-x-2'>
          {' '}
          <span>Income vs Expenses</span>
          <span>
            {' '}
            <Tooltipp
              text={'This is the overall income and expenes for all budgets'}
            />
          </span>
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Budget Overview</CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='Spent' stackId='a' fill='#8884d8' />
                <Bar dataKey='Remaining' stackId='a' fill='#82ca9d' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
