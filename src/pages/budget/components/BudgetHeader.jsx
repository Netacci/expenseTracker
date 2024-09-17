/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Edit,
  Trash2,
  EllipsisVertical,
  Download,
  Loader2,
} from 'lucide-react';
import BudgetInfo from './BudgetInfo';
import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { generateReport } from '../../../redux/budgetSlice';
// import { showErrorMessage } from '../../../components/toast/Toast';
const BudgetHeader = ({
  handleEdit,
  handleOpenDelete,
  budget,
  setIsAddIncomeOpen,
  setIsAddCategoryOpen,
  activeTab,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  // const [generatingReport, setGeneratingReport] = useState(false);

  // const dispatch = useDispatch();
  // const handleGenerateReport = async () => {
  //   setGeneratingReport(true);
  //   try {
  //     await dispatch(generateReport(budget?.id)).unwrap();
  //   } catch (err) {
  //     console.log(err);
  //     showErrorMessage('Error generating report', 'error');
  //   } finally {
  //     setGeneratingReport(false);
  //   }
  // };

  return (
    <div className='flex flex-col  mb-6 sm:flex-row sm:justify-between sm:items-center'>
      <div className='flex items-center '>
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
        {/* <Button
          variant='ghost'
          className='p-0 m-0 text-blue-500 underline hover:no-underline'
          onClick={handleGenerateReport}
        >
          Generate report
        </Button> */}
        {/* {generatingReport ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : budget?.reportGenerated ? (
          <Button variant='ghost' size='icon' onClick={handleOpenDelete}>
            <Download className='mr-2 h-4 w-4' />
          </Button>
        ) : null} */}
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
