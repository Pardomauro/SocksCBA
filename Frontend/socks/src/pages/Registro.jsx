import { useState } from 'react';
import logo from '../assets/logoSocks.jpg';
import { register } from '../services/userService';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({ nombre, email, password });
      setSuccess('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      setNombre(''); setEmail(''); setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src={logo} alt="Logo Socks" className="w-28 h-28 object-contain mb-6" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Registro de usuario</h1>
        <form className="w-full flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
