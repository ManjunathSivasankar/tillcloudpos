import React, { useState } from 'react';
import { X, Info, ChevronDown } from 'lucide-react';

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (data: { fullName: string; email: string; role: string }) => void;
}

const ROLES = ['Admin', 'Manager', 'Cashier', 'Kitchen Staff'];

export default function InviteStaffModal({ isOpen, onClose, onInvite }: InviteStaffModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Cashier');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onInvite) {
      onInvite({ fullName, email, role });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl shadow-black/20 overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-[24px] font-black text-[#0c1424]">Invite Staff</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-[#0c1424] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
          <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
            New team members will receive an email to set up their account and PIN.
          </p>

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Robert Smith"
              className="w-full h-12 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-[14px] font-bold text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-[#0c1424]/5 focus:border-[#0c1424]/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="r.smith@tillcloud.com"
              className="w-full h-12 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-[14px] font-bold text-[#0c1424] focus:outline-none focus:ring-2 focus:ring-[#0c1424]/5 focus:border-[#0c1424]/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
            />
          </div>

          {/* Role Dropdown */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Role
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-12 px-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[14px] font-bold text-[#0c1424] hover:bg-slate-100/50 transition-all"
            >
              <span>{role}</span>
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl z-10 py-2 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[14px] font-bold transition-colors ${role === r ? 'bg-slate-50 text-[#0c1424]' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/50 border-l-4 border-[#5dc7ec] rounded-2xl p-5 flex gap-4">
             <div className="h-6 w-6 rounded-full bg-[#5dc7ec]/10 flex items-center justify-center text-[#5dc7ec] shrink-0 mt-0.5">
               <Info size={14} />
             </div>
             <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
               Invited users will have default access to POS terminals. You can refine permissions in settings after they join.
             </p>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-col gap-3">
             <button
               type="submit"
               className="w-full h-14 bg-[#0c1424] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all"
             >
               Send Invite
             </button>
             <button
               type="button"
               onClick={onClose}
               className="w-full h-12 text-slate-400 font-black uppercase tracking-widest hover:text-[#0c1424] transition-all"
             >
               Cancel
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
