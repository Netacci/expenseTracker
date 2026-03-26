/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../components/navbar/Layout';
import { useDispatch } from 'react-redux';
import { fetchSavedPlanReport } from '../../redux/budgetSlice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ROUTES } from '../../utils/routes';

const ReportView = () => {
  const { planId } = useParams();
  const dispatch = useDispatch();
  const [html, setHtml] = useState('');
  const [planName, setPlanName] = useState('');
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await dispatch(fetchSavedPlanReport(planId)).unwrap();
        if (!cancelled) {
          setHtml(data.html);
          setPlanName(data.planName || 'Plan');
          setGeneratedAt(data.generatedAt ? new Date(data.generatedAt) : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Could not load this report.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, planId]);

  return (
    <Layout>
      <div className='max-w-4xl mx-auto'>
        <Button variant='ghost' size='sm' className='rounded-xl -ml-2 mb-4' asChild>
          <Link to={ROUTES.reports}>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to Tabs
          </Link>
        </Button>

        {loading ? (
          <div className='flex items-center justify-center py-24 text-slate-500'>
            <Loader2 className='h-8 w-8 animate-spin mr-2' />
            Loading report…
          </div>
        ) : error ? (
          <div className='rounded-2xl border border-rose-100 bg-rose-50 px-6 py-8 text-center'>
            <p className='text-rose-800'>{error}</p>
            <Button asChild className='mt-4 rounded-xl' variant='outline'>
              <Link to={ROUTES.reports}>Back to Tabs</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='mb-4'>
              <h1 className='text-xl font-bold text-slate-900'>{planName}</h1>
              {generatedAt && (
                <p className='text-sm text-slate-500'>
                  Generated {format(generatedAt, 'MMMM d, yyyy · h:mm a')}
                </p>
              )}
            </div>
            <div className='rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm'>
              {html ? (
                <iframe
                  title='Saved AI report'
                  srcDoc={html}
                  className='w-full min-h-[70vh] border-0 bg-white'
                />
              ) : null}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReportView;
