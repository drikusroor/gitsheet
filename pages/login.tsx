import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      // Force a hard reload to ensure all auth states are properly updated
      window.location.href = '/';
    } catch (err) {
      setError('Invalid token or name');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg p-8">
        <h2 className="text-center text-3xl font-bold mb-6">Login</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Magic Token</label>
            <input
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
