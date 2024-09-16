// src/components/GoogleCallback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../../utils/routes';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      navigate(ROUTES.dashboard);
    } else {
      navigate(ROUTES.login);
    }
  }, [dispatch, navigate, token]);

  return <div>Processing...</div>;
};

export default GoogleCallback;
