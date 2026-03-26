/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBudgets } from '../../redux/budgetSlice';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { docId } from '../../utils/docId';
import { ROUTES } from '../../utils/routes';

const ReportsList = () => {
  const dispatch = useDispatch();
  const { budgets, loading } = useSelector((state) => state.budget);

  useEffect(() => {
    dispatch(fetchAllBudgets());
  }, [dispatch]);

  const withReports =
    budgets?.filter((p) => p.hasSavedReport === true) ?? [];

  return (
    <Layout>
      <div className='max-w-3xl'>
        <h1 className='text-2xl font-bold text-slate-900'>Tabs</h1>
        <p className='text-sm text-slate-500 mt-1 mb-6'>
          Saved AI reports — one per monthly plan. Open a plan to generate a report
          (you can only do this once per plan).
        </p>

        {loading || budgets === null ? (
          <div className='animate-pulse h-32 bg-slate-100 rounded-2xl' />
        ) : withReports.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center'>
            <FileText className='h-10 w-10 text-slate-300 mx-auto mb-3' />
            <p className='text-slate-600 font-medium'>No saved reports yet</p>
            <p className='text-sm text-slate-500 mt-2 max-w-sm mx-auto'>
              Open a plan and use <strong>Generate AI report</strong> once the month
              is far enough along. It will appear here.
            </p>
            <Button asChild className='mt-6 rounded-xl' variant='outline'>
              <Link to={ROUTES.budgets}>Go to plans</Link>
            </Button>
          </div>
        ) : (
          <ul className='space-y-2'>
            {withReports.map((plan) => {
              const id = docId(plan);
              const period =
                plan.year != null && plan.month != null
                  ? format(new Date(plan.year, plan.month - 1, 1), 'MMMM yyyy')
                  : '';
              return (
                <li key={id}>
                  <Link
                    to={`${ROUTES.reports}/${id}`}
                    className='flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all'
                  >
                    <div className='min-w-0 text-left'>
                      <p className='font-semibold text-slate-900 truncate'>
                        {plan.name || 'Plan'}
                      </p>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {period}
                        {plan.reportGeneratedAt
                          ? ` · Saved ${format(new Date(plan.reportGeneratedAt), 'MMM d, yyyy')}`
                          : ''}
                      </p>
                    </div>
                    <ChevronRight className='h-5 w-5 text-slate-400 shrink-0' />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default ReportsList;
