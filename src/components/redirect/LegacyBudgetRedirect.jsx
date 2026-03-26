import { Navigate, useParams } from 'react-router-dom';

/** Old `/budget/:id` links → monthly plan detail. */
const LegacyBudgetRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/plans/${id}`} replace />;
};

export default LegacyBudgetRedirect;
