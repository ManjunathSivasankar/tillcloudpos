import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ReceiptText, ShoppingBag } from 'lucide-react';
import { BillItem, usePosCart } from './context/PosCartContext';

type CheckoutLocationState = {
  from?: string;
  billItems?: BillItem[];
  totalItems?: number;
  billTotal?: number;
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { billItems: liveBillItems, totalItems: liveTotalItems, billTotal: liveBillTotal } = usePosCart();

  const locationState = (location.state || {}) as CheckoutLocationState;

  const billItems = locationState.billItems && locationState.billItems.length > 0 ? locationState.billItems : liveBillItems;
  const totalItems = locationState.totalItems ?? liveTotalItems;
  const billTotal = locationState.billTotal ?? liveBillTotal;

  const formatCurrency = useMemo(
    () => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#5dc7ec]">Checkout</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0c1424]">Review current bill</h1>
            <p className="mt-1 text-sm text-slate-500">The bill data was passed forward from POS for payment completion.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/pos')}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black uppercase tracking-[0.14em] text-[#0c1424] hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to POS
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Bill Items</div>
                <div className="mt-1 text-xl font-black text-[#0c1424]">{billItems.length > 0 ? `${totalItems} items` : 'No items selected'}</div>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <ShoppingBag className="h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {billItems.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
                  No bill data was passed into checkout.
                </div>
              ) : (
                billItems.map((item) => (
                  <article key={item.id} className="rounded-[24px] border border-slate-100 bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[15px] font-black text-[#0c1424]">{item.name}</div>
                        <div className="mt-1 text-sm text-slate-500">Qty {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Line total</div>
                        <div className="text-lg font-black text-[#0c1424]">{formatCurrency.format(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="rounded-[28px] bg-[#0c1424] p-6 text-white shadow-2xl shadow-black/10">
            <div className="flex items-center gap-3 text-[#5dc7ec]">
              <ReceiptText className="h-5 w-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.22em]">Payment Summary</span>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="font-black text-white">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-black text-white">{formatCurrency.format(billTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST</span>
                <span className="font-black text-white">Calculated at payment</span>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-white/5 p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white/50">Next step</div>
              <div className="mt-2 text-2xl font-black tracking-tight">Collect payment</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">This screen now receives the full bill payload from the POS terminal. Connect your payment flow here.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}