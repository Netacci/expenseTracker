import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/routes.js';
import PrivateRoute from './components/privateRoute/PrivateRoute.jsx';
import Loader from './components/loader/Loader.jsx';

const App = () => {
  const Home = lazy(() => import('./pages/home/Home.jsx'));
  const Signup = lazy(() => import('./pages/auth/Signup.jsx'));
  const Login = lazy(() => import('./pages/auth/Login.jsx'));
  const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.jsx'));
  const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback.jsx'));
  const Budgets = lazy(() => import('./pages/budgets/Budgets.jsx'));
  const BudgetDetail = lazy(() => import('./pages/budget/Budget.jsx'));
  const Settings = lazy(() => import('./pages/userProfile/Settings.jsx'));
  const Profile = lazy(() => import('./pages/userProfile/Profile.jsx'));
  const RegisterSuccess = lazy(() =>
    import('./pages/auth/RegisterSuccess.jsx')
  );
  const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
  const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail.jsx'));
  const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));
  return (
    <>
      <Routes>
        <Route
          path={ROUTES.signup}
          element={
            <Suspense fallback={<Loader />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.home}
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.registerSuccess}
          element={
            <Suspense fallback={<Loader />}>
              <RegisterSuccess />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.login}
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.callback}
          element={
            <Suspense fallback={<Loader />}>
              <GoogleCallback />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.confirmEmail}
          element={
            <Suspense fallback={<Loader />}>
              <VerifyEmail />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.dashboard}
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.budgets}
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <Budgets />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path='/budget/:id'
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <BudgetDetail />
              </PrivateRoute>
            </Suspense>
          }
        />

        <Route
          path={ROUTES.settings}
          element={
            <Suspense>
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path={ROUTES.profile}
          element={
            <Suspense>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </Suspense>
          }
        />

        <Route
          path={ROUTES.forgot_password}
          element={
            <Suspense>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.reset_password}
          element={
            <Suspense>
              <ResetPassword />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};

export default App;
