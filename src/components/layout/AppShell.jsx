/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Settings,
  PlusCircle,
  LayoutDashboard,
  Layers,
  Wallet,
  User,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
  Menu,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../utils/routes';
import { cn } from '@/lib/utils';
import AddBudgetForm from '../../pages/budgets/components/AddBudget';

const STORAGE_KEY = 'expenseTracker.sidebarCollapsed';

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.budgets, label: 'Plans', icon: Wallet },
 
  { to: ROUTES.invoices, label: 'Invoices', icon: FileText },
  { to: ROUTES.subscriptions, label: 'Subscriptions', icon: RefreshCw },
  { to: ROUTES.reports, label: 'Reports', icon: Layers },
];

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'false');
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('Xtoken');
    navigate(ROUTES.login);
    window.location.reload();
  };

  const initials = user?.first_name ? user.first_name[0].toUpperCase() : 'U';
  const pageMeta = useMemo(() => {
    const path = location.pathname || '';
    if (path.startsWith('/plans/') && path.includes('/buckets/')) {
      return {
        title: 'Spending area',
        subtitle: 'Track categories and expenses for this plan group',
      };
    }
    if (path.startsWith('/plans/')) {
      return { title: 'Plan details', subtitle: 'Income, spending groups, and report tools' };
    }
    if (path.startsWith('/plans')) {
      return { title: 'Monthly plans', subtitle: 'Search, filter, and manage your monthly plans' };
    }
    if (path.startsWith('/invoices')) {
      return { title: 'Invoices', subtitle: 'Create, send, and track payment status' };
    }
    if (path.startsWith('/subscriptions')) {
      return { title: 'Subscriptions', subtitle: 'Monitor recurring costs and renewals' };
    }
    if (path.startsWith('/reports')) {
      return { title: 'Reports', subtitle: 'View saved AI spending reports' };
    }
    if (path.startsWith('/dashboard')) {
      return { title: 'Dashboard', subtitle: 'Your money overview across plans, invoices, and subscriptions' };
    }
    return { title: 'ExpenseTracker', subtitle: 'Track and manage your finances' };
  }, [location.pathname]);

  const sidebarInner = (
    <>
      <div
        className={cn(
          'flex items-center gap-2 h-16 px-3 border-b border-slate-100 flex-shrink-0',
          collapsed && 'justify-center px-2'
        )}
      >
        <Link
          to={ROUTES.dashboard}
          className='flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden'
          onClick={() => setMobileOpen(false)}
        >
          <div className='w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0'>
            <DollarSign className='h-4 w-4 text-white' />
          </div>
          {!collapsed && (
            <span className='font-bold text-slate-900 text-base truncate'>ExpenseTracker</span>
          )}
        </Link>
        <button
          type='button'
          onClick={() => setCollapsed((c) => !c)}
          className='hidden md:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex-shrink-0'
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </button>
      </div>

      <div className='flex-1 overflow-y-auto py-4 px-2 space-y-1'>
        {navItems.map(({ to, label, icon: Icon, end = false }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className='h-5 w-5 flex-shrink-0' />
            {!collapsed && <span className='truncate'>{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className={cn('p-2 border-t border-slate-100 space-y-2', collapsed && 'px-1')}>
        <button
          type='button'
          onClick={() => {
            setIsAddPlanOpen(true);
            setMobileOpen(false);
          }}
          className={cn(
            'w-full flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-colors',
            collapsed ? 'justify-center p-2.5' : 'justify-center px-3 py-2.5'
          )}
          title={collapsed ? 'New monthly plan' : undefined}
        >
          <PlusCircle className='h-5 w-5 flex-shrink-0' />
          {!collapsed && <span>New plan</span>}
        </button>

        <div className='relative'>
          <button
            type='button'
            onClick={() => setProfileOpen((p) => !p)}
            className={cn(
              'w-full flex items-center gap-2 rounded-xl hover:bg-slate-100 transition-colors text-left',
              collapsed ? 'justify-center p-2' : 'px-2 py-2'
            )}
          >
            <div className='w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
              {initials}
            </div>
            {!collapsed && (
              <>
                <span className='text-sm font-medium text-slate-800 truncate flex-1 min-w-0'>
                  {user?.first_name || 'Account'}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-slate-400 flex-shrink-0 transition-transform',
                    profileOpen && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>

          {profileOpen && (
            <>
              <div
                className='fixed inset-0 z-[60]'
                aria-hidden
                onClick={() => setProfileOpen(false)}
              />
              <div
                className={cn(
                  'absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-[70]',
                  collapsed && 'left-0'
                )}
              >
                <Link
                  to={ROUTES.profile}
                  className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'
                  onClick={() => setProfileOpen(false)}
                >
                  <User className='h-4 w-4 text-slate-400' />
                  Profile
                </Link>
                <Link
                  to={ROUTES.settings}
                  className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50'
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className='h-4 w-4 text-slate-400' />
                  Settings
                </Link>
                <div className='border-t border-slate-50 my-1' />
                <button
                  type='button'
                  onClick={handleLogout}
                  className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50'
                >
                  <LogOut className='h-4 w-4' />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className='h-screen bg-slate-50 overflow-hidden'>
        <header className='fixed inset-x-0 top-0 z-40 h-14 border-b border-slate-200 bg-white'>
          <div className='h-full px-4 md:px-6 flex items-center justify-between gap-3'>
            <button
              type='button'
              onClick={() => setMobileOpen(true)}
              className='p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden'
              aria-label='Open menu'
            >
              <Menu className='h-6 w-6' />
            </button>
            <Link to={ROUTES.dashboard} className='font-bold text-slate-900 md:hidden'>
              ExpenseTracker
            </Link>
            <div className='hidden md:flex items-center justify-between w-full'>
              <div className='min-w-0'>
                <p className='text-sm font-semibold text-slate-900 truncate'>{pageMeta.title}</p>
                <p className='text-xs text-slate-500 truncate'>{pageMeta.subtitle}</p>
              </div>
              <div className='flex items-center gap-3 ml-4'>
                <button
                  type='button'
                  onClick={() => setIsAddPlanOpen(true)}
                  className='inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 transition-colors'
                >
                  <PlusCircle className='h-3.5 w-3.5' />
                  New plan
                </button>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs'>
                    {initials}
                  </div>
                  <span className='text-xs font-medium text-slate-700 max-w-[10rem] truncate'>
                    {user?.first_name || 'Account'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            type='button'
            className='fixed inset-x-0 top-14 bottom-0 bg-black/40 z-30 md:hidden'
            aria-label='Close menu'
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className='pt-14 h-full flex'>
          <aside
            className={cn(
              'fixed top-14 left-0 z-50 h-[calc(100vh-56px)] flex flex-col border-r border-slate-200 bg-white shadow-sm transition-[width,transform] duration-200 ease-out',
              collapsed ? 'md:w-[72px]' : 'w-[min(18rem,85vw)] md:w-60',
              !mobileOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
            )}
          >
            <button
              type='button'
              className='md:hidden absolute top-4 right-3 p-2 rounded-lg text-slate-500 hover:bg-slate-100 z-10'
              onClick={() => setMobileOpen(false)}
              aria-label='Close sidebar'
            >
              <X className='h-5 w-5' />
            </button>
            {sidebarInner}
          </aside>

          <div
            className={cn(
              'flex-1 min-w-0 h-[calc(100vh-56px)] overflow-y-auto',
              collapsed ? 'md:ml-[72px]' : 'md:ml-60'
            )}
          >
            {children}
          </div>
        </div>
      </div>

      <AddBudgetForm isOpen={isAddPlanOpen} onClose={() => setIsAddPlanOpen(false)} />
    </>
  );
};

export default AppShell;
