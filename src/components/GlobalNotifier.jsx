import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalNotifier() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      const msg = e?.detail?.message || 'Session expired. Please sign in again.';
      setMessage(msg);
      setVisible(true);
    };

    window.addEventListener('sims:auth:expired', handler);
    return () => window.removeEventListener('sims:auth:expired', handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-2xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800 shadow">
      <div className="flex items-center gap-3">
        <div className="flex-1">{message}</div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/login')}
            className="rounded-md bg-yellow-600 px-3 py-1 text-sm text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => setVisible(false)}
            className="rounded-md bg-transparent px-3 py-1 text-sm text-yellow-800 border border-yellow-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
