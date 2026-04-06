import { useAuth } from './context/AuthContext';

export default function KitchenDisplay() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#141414] text-white p-5 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Kitchen Display</h1>
            <p className="text-slate-300 mt-1">Terminal: {user?.fullName || 'Kitchen'}</p>
          </div>
          <button
            onClick={() => {
              void logout();
            }}
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-bold hover:bg-slate-800"
          >
            Unpair
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['#101', '#102', '#103', '#104', '#105'].map((ticket) => (
            <article
              key={ticket}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
            >
              <div className="text-lg font-black mb-2">Order {ticket}</div>
              <ul className="space-y-2 text-slate-200">
                <li>2x Chicken Burger</li>
                <li>1x Fries</li>
                <li>1x Coke</li>
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
