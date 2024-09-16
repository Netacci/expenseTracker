/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Edit,
  Trash2,
  EllipsisVertical,
  Download,
} from 'lucide-react';
import BudgetInfo from './BudgetInfo';
import { useState } from 'react';
const BudgetHeader = ({
  handleEdit,
  handleOpenDelete,
  budget,
  setIsAddIncomeOpen,
  setIsAddCategoryOpen,
  activeTab,
}) => {
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <div className='flex flex-col  mb-6 sm:flex-row sm:justify-between sm:items-center'>
      <div className='flex items-center space-x-2 sm:space-x-0'>
        <h1 className='text-2xl sm:text-3xl font-bold'>{budget?.name}</h1>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setOpenDetails(true)}
        >
          <EllipsisVertical className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleEdit}>
          <Edit className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleOpenDelete}>
          <Trash2 className='h-4 w-4 text-red-500' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleOpenDelete}>
          <Download className='mr-2 h-4 w-4' />
        </Button>
      </div>
      <div className='flex  sm:justify-end sm:space-x-2 mt-4'>
        {activeTab === 'income' && (
          <Button
            onClick={() => setIsAddIncomeOpen(true)}
            variant='outline'
            className='bg-green-50 text-green-700 hover:bg-green-100 border-green-200'
          >
            <PlusCircle className='mr-2 h-4 w-4' /> Add Income
          </Button>
        )}
        {activeTab === 'expenses' && (
          <Button
            onClick={() => setIsAddCategoryOpen(true)}
            variant='outline'
            className='bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
          >
            <PlusCircle className='mr-2 h-4 w-4' /> Create Expense Category
          </Button>
        )}
      </div>

      <BudgetInfo
        isOpen={openDetails}
        isClose={() => setOpenDetails(false)}
        budget={budget}
      />
    </div>
  );
};

export default BudgetHeader;
