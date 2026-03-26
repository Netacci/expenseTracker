/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/navbar/Layout';
import Charts from './components/Charts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBudgets } from '../../redux/budgetSlice';
import { fetchSubscriptions } from '../../redux/subscriptionSlice';
import RecentBudgets from './components/RecentBudgets';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  FileText,
  RefreshCw,
  Clock3,
} from 'lucide-react';
import { currencySymbol, formatAmount } from '../../utils/helper';
import { userRequest } from '../../utils/requestMethods';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const StatCard = ({ label, value, icon: Icon, color, bgColor, change }) => (
  <div className='bg-white rounded-2xl p-5 border border-slate-100 shadow-card'>
    <div className='flex items-start justify-between mb-4'>
      <div className={`w-11 h-11 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      {change !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className='text-sm font-medium text-slate-500 mb-1'>{label}</p>
    <p className='text-2xl font-bold text-slate-900 tracking-tight'>{value}</p>
  </div>
);

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    paid: 0,
    sent: 0,
    draft: 0,
    loading: true,
  });
  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);
  const { subscriptions } = useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchAllBudgets());
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadInvoiceStats = async () => {
      try {
        const [allRes, paidRes, sentRes, draftRes] = await Promise.all([
          userRequest.get('/invoices', { params: { page: 1, limit: 1 } }),
          userRequest.get('/invoices', { params: { page: 1, limit: 1, status: 'paid' } }),
          userRequest.get('/invoices', { params: { page: 1, limit: 1, status: 'sent' } }),
          userRequest.get('/invoices', { params: { page: 1, limit: 1, status: 'draft' } }),
        ]);
        if (!mounted) return;
        setInvoiceStats({
          total: allRes?.data?.pagination?.total || 0,
          paid: paidRes?.data?.pagination?.total || 0,
          sent: sentRes?.data?.pagination?.total || 0,
          draft: draftRes?.data?.pagination?.total || 0,
          loading: false,
        });
      } catch {
        if (!mounted) return;
        setInvoiceStats((prev) => ({ ...prev, loading: false }));
      }
    };
    loadInvoiceStats();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let income = 0;
    let expenses = 0;
    budgets?.forEach((budget) => {
      income += budget.total_income || 0;
      expenses += budget.total_expenses || 0;
    });
    setTotalIncome(income);
    setTotalExpenses(expenses);
  }, [budgets]);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  const currency = budgets?.[0]?.currency;
  const fmt = (n) => formatAmount(n);
  const activeSubs = useMemo(
    () => (subscriptions || []).filter((s) => s.status === 'active'),
    [subscriptions]
  );
  const monthlySubCommitment = useMemo(
    () =>
      activeSubs.reduce((sum, s) => {
        const amount = Number(s.amount || 0);
        return sum + (s.billing_cycle === 'yearly' ? amount / 12 : amount);
      }, 0),
    [activeSubs]
  );
  const subCurrency = useMemo(() => activeSubs[0]?.currency || currency, [activeSubs, currency]);

  if (!budgets) {
    return (
      <Layout dashboard>
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='bg-white rounded-2xl h-28 animate-pulse border border-slate-100' />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout dashboard>
      <div className='space-y-6'>
        {/* Finance snapshot */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            label='Total Income'
            value={`${currencySymbol(currency)} ${fmt(totalIncome)}`}
            icon={TrendingUp}
            color='text-emerald-600'
            bgColor='bg-emerald-50'
          />
          <StatCard
            label='Total Expenses'
            value={`${currencySymbol(currency)} ${fmt(totalExpenses)}`}
            icon={TrendingDown}
            color='text-rose-500'
            bgColor='bg-rose-50'
          />
          <StatCard
            label='Net Balance'
            value={`${currencySymbol(currency)} ${fmt(balance)}`}
            icon={PiggyBank}
            color={balance >= 0 ? 'text-blue-600' : 'text-amber-600'}
            bgColor={balance >= 0 ? 'bg-blue-50' : 'bg-amber-50'}
            change={savingsRate}
          />
          <StatCard
            label='Active Plans'
            value={budgets?.length || 0}
            icon={Wallet}
            color='text-violet-600'
            bgColor='bg-violet-50'
          />
        </div>

        {/* Invoices + subscriptions snapshot */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <Link
            to={ROUTES.invoices}
            className='block bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover hover:border-indigo-200 transition-all'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <div className='w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center'>
                  <FileText className='h-5 w-5 text-indigo-600' />
                </div>
                <h3 className='font-bold text-slate-900'>Invoices</h3>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div className='rounded-xl bg-slate-50 p-3'>
                <p className='text-slate-500'>Total</p>
                <p className='text-lg font-bold text-slate-900'>
                  {invoiceStats.loading ? '…' : invoiceStats.total}
                </p>
              </div>
              <div className='rounded-xl bg-emerald-50 p-3'>
                <p className='text-emerald-700'>Paid</p>
                <p className='text-lg font-bold text-emerald-700'>
                  {invoiceStats.loading ? '…' : invoiceStats.paid}
                </p>
              </div>
              <div className='rounded-xl bg-blue-50 p-3'>
                <p className='text-blue-700'>Sent</p>
                <p className='text-lg font-bold text-blue-700'>
                  {invoiceStats.loading ? '…' : invoiceStats.sent}
                </p>
              </div>
              <div className='rounded-xl bg-amber-50 p-3'>
                <p className='text-amber-700'>Draft</p>
                <p className='text-lg font-bold text-amber-700'>
                  {invoiceStats.loading ? '…' : invoiceStats.draft}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.subscriptions}
            className='block bg-white rounded-2xl p-5 border border-slate-100 shadow-card lg:col-span-2 hover:shadow-card-hover hover:border-cyan-200 transition-all'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <div className='w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center'>
                  <RefreshCw className='h-5 w-5 text-cyan-600' />
                </div>
                <h3 className='font-bold text-slate-900'>Subscriptions</h3>
              </div>
            </div>
            <div className='grid sm:grid-cols-2 gap-3'>
              <div className='rounded-xl bg-slate-50 p-3'>
                <p className='text-slate-500 text-sm'>Active</p>
                <p className='text-lg font-bold text-slate-900'>{activeSubs.length}</p>
              </div>
              <div className='rounded-xl bg-cyan-50 p-3'>
                <p className='text-cyan-700 text-sm flex items-center gap-1'>
                  <Clock3 className='h-3.5 w-3.5' />
                  Monthly commitment
                </p>
                <p className='text-lg font-bold text-cyan-700'>
                  {currencySymbol(subCurrency)} {fmt(monthlySubCommitment)}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Plan charts */}
        <Charts
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          budgets={budgets}
        />

        {/* Recent plans */}
        <RecentBudgets budgets={budgets} />
      </div>
    </Layout>
  );
};

export default Dashboard;
