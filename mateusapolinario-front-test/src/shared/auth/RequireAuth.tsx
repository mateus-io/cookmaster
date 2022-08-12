import { useLocation, Navigate } from 'react-router-dom';
import * as TokenHelper from '../../shared/helpers/Token';

interface RequireAuthProps {
  children: JSX.Element,
}

function RequireAuth({ children }: RequireAuthProps) {
  const token = TokenHelper.getToken();
  let location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export { RequireAuth };