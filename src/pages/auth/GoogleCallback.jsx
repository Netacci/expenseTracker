// src/components/GoogleCallback.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { ROUTES } from '../../utils/routes';
import Error from '../error/Error';

const GoogleCallback = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const queryParams = new URLSearchParams(window.location.search);
  // const token = queryParams.get('token');
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      // Since the cookie is already set by the backend, just navigate to the dashboard
      navigate(ROUTES.dashboard);
    } catch (error) {
      setError(true);
      console.error('Error during Google authentication callback:', error);
    }
  }, [navigate]);

  // useEffect(() => {
  //   try {
  //     if (token) {
  //       localStorage.setItem('token', token);
  //       navigate(ROUTES.dashboard);
  //     } else {
  //       throw new Error('No token provided');
  //     }
  //   } catch (error) {
  //     setError(true);
  //     console.error(error);
  //   }
  // }, [dispatch, navigate, token]);

  if (error) {
    return <Error />;
  }

  return <div>Processing...</div>;
};

export default GoogleCallback;
