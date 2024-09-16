/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  Settings,
  PlusCircle,
  Menu,
  Home,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '../../utils/routes';
import AddBudgetForm from '../../pages/budgets/components/AddBudget';

const DesktopNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      }`
    }
  >
    {children}
  </NavLink>
);
const MobileNavLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center transition-colors duration-200 ${
        isActive ? 'text-blue-600' : 'text-gray-500'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : ''}`} />
        <span className={`text-xs ${isActive ? 'text-blue-600' : ''}`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);
const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(ROUTES.login);
    window.location.reload();
  };
  // TODO lets make the nav hightlight on the page we are
  return (
    <div>
      <nav className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex '>
              <Link to='/' className='flex-shrink-0 flex items-center'>
                <span className='text-xl font-bold text-blue-600'>
                  ExpenseTracker
                </span>
              </Link>
              <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                <DesktopNavLink to='/dashboard'>Dashboard</DesktopNavLink>
                <DesktopNavLink to='/budgets'>Budgets</DesktopNavLink>

                <Button
                  onClick={() => setIsAddBudgetOpen(true)}
                  className='ml-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md flex items-center'
                >
                  <PlusCircle className='mr-2 h-5 w-5' />
                  Create Budget
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className='flex sm:hidden'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className='h-6 w-6' />
              </Button>
            </div>

            <div className='hidden sm:ml-6 sm:flex sm:items-center'>
              <Button variant='ghost' size='icon' asChild>
                <Link to={ROUTES.settings}>
                  <Settings className='h-5 w-5' />
                </Link>
              </Button>
              <div className='ml-3 relative'>
                <div>
                  <Button variant='ghost' size='icon'>
                    <Link to={ROUTES.profile}>
                      <User className='h-5 w-5' />
                    </Link>
                  </Button>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleLogout}
                className='ml-3'
              >
                <LogOut className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className='sm:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              <Link
                to={ROUTES.settings}
                className='text-gray-700 block px-3 py-2 rounded-md text-base font-medium'
              >
                <Settings className='h-5 w-5 inline-block mr-2' />
                Settings
              </Link>
              <Link
                to={ROUTES.profile}
                className='text-gray-700 block px-3 py-2 rounded-md text-base font-medium'
              >
                <User className='h-5 w-5 inline-block mr-2' />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className='text-gray-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium'
              >
                <LogOut className='h-5 w-5 inline-block mr-2' />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      <nav className='sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md py-2 z-10'>
        <div className='flex justify-around items-center'>
          {/* <Link to={ROUTES.dashboard} className='flex flex-col items-center'>
            <Home className='h-6 w-6' />
            <span className='text-xs'>Dashboard</span>
          </Link>
          <Link to={ROUTES.budgets} className='flex flex-col items-center'>
            <PieChart className='h-6 w-6' />
            <span className='text-xs'>Budgets</span>
          </Link> */}
          <MobileNavLink to='/dashboard' icon={Home} label='Dashboard' />
          <MobileNavLink to='/budgets' icon={PieChart} label='Budgets' />
          <Button
            className='flex flex-col items-center'
            variant='ghost'
            size='icon'
            onClick={() => setIsAddBudgetOpen(true)}
          >
            <PlusCircle className='h-6 w-6 text-blue-600' />
            <span className='text-xs'>Add Budget</span>
          </Button>
        </div>
      </nav>

      <AddBudgetForm
        isOpen={isAddBudgetOpen}
        onClose={() => setIsAddBudgetOpen(false)}
      />
    </div>
  );
};

export default Navbar;
