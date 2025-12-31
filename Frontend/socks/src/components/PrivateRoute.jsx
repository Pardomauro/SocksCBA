import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../Context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" />;
}
