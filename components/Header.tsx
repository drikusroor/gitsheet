import { useAuth } from './AuthProvider';
import { useRouter } from 'next/router';

export default function Header() {
  const { userName } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login'; // Force full page reload
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
      <div className="text-gray-700">
        Welcome, <span className="font-semibold text-blue-600">{userName || 'Guest'}</span>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-1 text-sm text-gray-600 hover:text-gray-900 border rounded-md hover:bg-gray-50 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
