/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Info } from 'lucide-react';
import BudgetInfo from './BudgetInfo';
import { useState } from 'react';

const BudgetHeader = ({
  handleEdit,
  handleOpenDelete,
  budget,
  /** Monthly plan (for plan month range when `budget` is a spending group) */
  plan,
  setIsAddIncomeOpen,
  setIsAddCategoryOpen,
  activeTab,
  hideIncomeActions = false,
  subtitle,
  /** When true, show “Add category” even if another tab is selected (bucket page). */
  alwaysShowAddCategory = false,
}) => {
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
      <div className='flex items-center gap-3 min-w-0'>
        <div>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold text-slate-900 truncate'>{budget?.name}</h1>
            <button
              onClick={() => setOpenDetails(true)}
              className='p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0'
              title='Details'
            >
              <Info className='h-4 w-4' />
            </button>
          </div>
          {subtitle && (
            <p className='text-sm text-slate-500 mt-0.5 truncate max-w-sm'>{subtitle}</p>
          )}
          {!subtitle && budget?.description && (
            <p className='text-sm text-slate-500 mt-0.5 truncate max-w-sm'>{budget.description}</p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2 flex-shrink-0'>
        {!hideIncomeActions && activeTab === 'income' && (
          <Button
            onClick={() => setIsAddIncomeOpen(true)}
            className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm text-sm font-semibold'
          >
            <PlusCircle className='h-4 w-4' />
            Add Income
          </Button>
        )}
        {(activeTab === 'expenses' || alwaysShowAddCategory) && (
          <Button
            onClick={() => setIsAddCategoryOpen(true)}
            className='flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-sm text-sm font-semibold'
          >
            <PlusCircle className='h-4 w-4' />
            Add category
          </Button>
        )}
        <button
          onClick={handleEdit}
          className='p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors'
          title='Edit'
        >
          <Edit className='h-4 w-4' />
        </button>
        <button
          onClick={handleOpenDelete}
          className='p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors'
          title='Delete spending group'
        >
          <Trash2 className='h-4 w-4' />
        </button>
      </div>

      <BudgetInfo
        isOpen={openDetails}
        isClose={() => setOpenDetails(false)}
        budget={budget}
        plan={plan}
      />
    </div>
  );
};

export default BudgetHeader;
