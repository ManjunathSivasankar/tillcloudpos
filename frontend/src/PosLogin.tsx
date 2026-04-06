import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import { useAuth } from './context/AuthContext';

export default function PosLogin() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/pos-login', { email, pin });
      login(response.data.access_token, response.data.user, 'pos', response.data.pos_session_token);
      navigate('/pos');
    } catch (submitError: unknown) {
      const fallback = 'Unable to login to POS. Please check your credentials.';
      if (typeof submitError === 'object' && submitError && 'response' in submitError) {
        const serverMessage = (submitError as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
        setError(Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage || fallback);
      } else {
        setError(fallback);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-[#0b1b3d] mb-2">POS Login</h1>
        <p className="text-slate-500 mb-8">Fast cashier sign-in with 4-digit PIN.</p>

        <form onSubmit={onSubmit} className="space-y-5">
          {error ? (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Cashier Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="cashier@restaurant.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              4 Digit PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xl tracking-[0.4em] outline-none focus:border-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#0b1b3d] text-white py-3 font-black uppercase tracking-wide disabled:opacity-70"
          >
            {submitting ? 'Signing In...' : 'Open POS'}
          </button>
        </form>
      </div>
    </div>
  );
}
