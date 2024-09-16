import { useState, useEffect } from 'react';
import Layout from '../../components/navbar/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteBudget,
  fetchAllBudgets,
  fetchSingleBudget,
} from '../../redux/budgetSlice';
import {
  showErrorMessage,
  showToastMessage,
} from '../../components/toast/Toast';
import { ROUTES } from '../../utils/routes';
import DeleteModal from '../../components/deleteModal/DeleteModal';
import BudgetCategories from './components/BudgetCategories';
import BudgetChart from './components/BudgetChart';
import BudgetSummary from './components/BudgetSummary';
import BudgetHeader from './components/BudgetHeader';
import RecentExpenses from './components/RecentExpenses';
import AddNewCategory from './components/AddNewCategory';
import AddNewIncome from './components/AddNewIncome';
import AddBudgetForm from '../budgets/components/AddBudget';
import BudgetIncome from './components/BudgetIncome';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchAllIncomes } from '../../redux/incomeSlice';
import {
  fetchAllCategories,
  fetchRecentExpenses,
} from '../../redux/expenseSlice';

const BudgetTracker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { budget } = useSelector((state) => state.budget);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { categories } = useSelector((state) => state.expense);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllIncomes(id));
    dispatch(fetchRecentExpenses(id));
  }, [dispatch, id]);

  const { recentExpenses } = useSelector((state) => state.expense);

  useEffect(() => {
    dispatch(fetchSingleBudget(id));
    dispatch(fetchAllCategories(id));
  }, [dispatch, id]);
  useEffect(() => {
    dispatch(fetchAllBudgets());
  }, [dispatch]);

  const handleEdit = () => {
    setIsFormOpen(true);
  };
  const handleOpenDelete = () => {
    setShowDeleteConfirm(true);
  };
  const handleCloseDelete = () => {
    if (!isDeleting) {
      setShowDeleteConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteBudget(id)).unwrap();
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      showToastMessage('Budget deleted successfully');
      await dispatch(fetchAllBudgets()).unwrap();
      navigate(ROUTES.budgets);
    } catch (err) {
      setIsDeleting(false);
      showErrorMessage(
        err?.response?.data?.message || 'Something went wrong. Try again!'
      );
    }
  };

  const totalIncome = budget?.total_income || 0;
  const totalExpenses = budget?.total_expenses || 0;
  const totalBudget = budget?.total_budget || 0;
  const balance = budget?.balance || totalIncome - totalExpenses || 0;

  // const getRecentExpenses = () => {
  //   return (
  //     expenses &&
  //     [...expenses]
  //       .sort((a, b) => new Date(b.date) - new Date(a.date))
  //       .slice(0, 5)
  //   );
  // };

  const getChartData = () => {
    return categories?.map((category) => ({
      name: category.name,
      budget: category.amount,
      spent: category.total_expenses,
    }));
  };

  const getIncomeVsExpensesData = () => {
    return [
      { name: 'Income', value: totalIncome },
      { name: 'Expenses', value: totalExpenses },
    ];
  };

  const [activeTab, setActiveTab] = useState('summary');
  // const warningCategoryvalue =
  //   budget?.total_budget > budget?.total_income ? true : false;
  const warningvalue =
    budget?.total_expense > budget?.total_income ? true : false;
  return (
    <Layout>
      {budget && (
        <div className='container mx-auto sm:px-4 pb-4'>
          <BudgetHeader
            handleEdit={handleEdit}
            handleOpenDelete={handleOpenDelete}
            budget={budget}
            setIsAddIncomeOpen={setIsAddIncomeOpen}
            setIsAddCategoryOpen={setIsAddCategoryOpen}
            activeTab={activeTab}
          />
          {warningvalue && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>
                Warning: Your expenses exceed your income! Consider reviewing
                your budget.
              </AlertDescription>
            </Alert>
          )}
          {/* {warningCategoryvalue && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>
                Warning: Your budget amount exceeds your income! Consider
                reviewing your budget or adding more income.
              </AlertDescription>
            </Alert>
          )} */}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3 mb-6 bg-white p-1 rounded-full shadow-sm'>
              <TabsTrigger
                value='summary'
                className='py-2 px-4 rounded-full text-gray-600 hover:bg-gray-100 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 transition-all duration-200 ease-in-out font-medium'
              >
                Budget Summary
              </TabsTrigger>
              <TabsTrigger
                value='expenses'
                className='py-2 px-4 rounded-full text-gray-600 hover:bg-gray-100 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 transition-all duration-200 ease-in-out font-medium'
              >
                Expenses
              </TabsTrigger>
              <TabsTrigger
                value='income'
                className='py-2 px-4 rounded-full text-gray-600 hover:bg-gray-100 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 transition-all duration-200 ease-in-out font-medium'
              >
                Income
              </TabsTrigger>
            </TabsList>
            <TabsContent value='summary'>
              <BudgetSummary
                totalBudget={totalBudget}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                currency={budget?.currency}
                balance={balance}
              />
              <BudgetChart
                getIncomeVsExpensesData={getIncomeVsExpensesData}
                getChartData={getChartData}
              />
            </TabsContent>
            <TabsContent value='expenses'>
              <BudgetCategories
                isAddCategoryOpen={isAddCategoryOpen}
                setIsAddCategoryOpen={setIsAddCategoryOpen}
                currency={budget?.currency}
              />
              <RecentExpenses
                categories={categories}
                expenses={recentExpenses}
                currency={budget?.currency}
              />
            </TabsContent>
            <TabsContent value='income'>
              <BudgetIncome currency={budget?.currency} />
            </TabsContent>
          </Tabs>

          <AddNewCategory
            isAddCategoryOpen={isAddCategoryOpen}
            setIsAddCategoryOpen={setIsAddCategoryOpen}
          />
          <AddNewIncome
            isAddIncomeOpen={isAddIncomeOpen}
            setIsAddIncomeOpen={setIsAddIncomeOpen}
          />
          <DeleteModal
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            name={budget?.name}
            label='budget'
            handleCloseDelete={handleCloseDelete}
          />
          <AddBudgetForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            budget={budget}
          />
        </div>
      )}
    </Layout>
  );
};

export default BudgetTracker;
