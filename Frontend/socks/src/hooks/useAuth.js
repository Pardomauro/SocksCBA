import { useState } from 'react';
import { login } from '../Services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      setUser({ email, token: res.token });
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { user, error, loading, loginUser };
}
