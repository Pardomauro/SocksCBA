import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuthContext();
  return user ? children : <Navigate to="/login" />;
}
