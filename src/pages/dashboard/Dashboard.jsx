import { useState, useEffect } from 'react';
import Layout from '../../components/navbar/Layout';
import Charts from './components/Charts';
// import BudgetSummary from './components/BudgetSummary';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBudgets } from '../../redux/budgetSlice';

import RecentBudgets from './components/RecentBudgets';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);

  useEffect(() => {
    dispatch(fetchAllBudgets());
  }, [dispatch]);

  useEffect(() => {
    // Calculate total income and expenses
    let totalIncome = 0;
    let totalExpenses = 0;
    budgets?.forEach((budget) => {
      totalIncome += budget.total_income || 0;
      totalExpenses += budget.total_expenses || 0;
    });

    setTotalIncome(totalIncome);
    setTotalExpenses(totalExpenses);
  }, [budgets]);

  // const balance = totalIncome - totalExpenses;

  return (
    <Layout dashboard>
      {!budgets ? (
        <div className='w-full h-full flex justify-center items-center'>
          <Loader2 className='w-10 h-10 animate-spin' />
        </div>
      ) : (
        <div className='space-y-6'>
          {/* <TotalAmounts
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          balance={balance}
        /> */}
          <Charts
            totalExpenses={totalExpenses}
            totalIncome={totalIncome}
            budgets={budgets}
          />
          {/* <BudgetSummary budgets={budgets} /> */}

          <RecentBudgets budgets={budgets} />
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
