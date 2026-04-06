import { ArrowLeft, BriefcaseBusiness, Monitor } from "lucide-react";
import { StaffInviteRow } from "../OnboardingFlow";
import { isValidEmail } from "../validation";

interface StaffTerminalsStepProps {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  invites: StaffInviteRow[];
  onInvitesChange: (rows: StaffInviteRow[]) => void;
}

export function StaffTerminalsStep({
  onBack,
  onNext,
  onSkip,
  invites,
  onInvitesChange,
}: StaffTerminalsStepProps) {
  const updateInvite = (id: string, field: keyof StaffInviteRow, value: string) => {
    onInvitesChange(
      invites.map((invite) =>
        invite.id === id
          ? {
              ...invite,
              [field]: value,
            }
          : invite,
      ),
    );
  };

  const sendInvite = (id: string) => {
    onInvitesChange(
      invites.map((invite) =>
        invite.id === id
          ? {
              ...invite,
              status: 'sent',
            }
          : invite,
      ),
    );
  };

  const addInviteRow = () => {
    onInvitesChange([
      ...invites,
      {
        id: crypto.randomUUID(),
        name: '',
        email: '',
        role: '',
        status: 'idle',
      },
    ]);
  };

  return (
    <section>
      <h1 className="text-[34px] sm:text-[52px] font-extrabold text-[#0b1324] leading-[1.05] tracking-[-0.02em]">
        Set up your staff & terminals
      </h1>
      <p className="text-slate-600 mt-3 text-[15px]">
        Invite your team and configure your billing counters. You can skip this and complete it later.
      </p>

      <div className="mt-8 rounded-[10px] border border-slate-200 bg-white overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <BriefcaseBusiness size={16} className="text-[#59c9ef]" />
            <h2 className="text-[20px] font-bold text-[#111827]">Invite Your Staff</h2>
          </div>

          <div className="space-y-3">
            {invites.map((invite) => {
              const canSend = isValidEmail(invite.email) && invite.role !== '';
              return (
                <div key={invite.id} className="grid md:grid-cols-[1fr_1fr_130px_110px] gap-3">
                  <input
                    type="text"
                    value={invite.name}
                    onChange={(event) => updateInvite(invite.id, 'name', event.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="h-10 rounded-md border border-slate-200 bg-[#f8fafc] px-3 text-[13px]"
                  />
                  <div>
                    <input
                      type="email"
                      value={invite.email}
                      onChange={(event) => updateInvite(invite.id, 'email', event.target.value)}
                      placeholder="alex@tillcloud.com"
                      className="h-10 w-full rounded-md border border-slate-200 bg-[#f8fafc] px-3 text-[13px]"
                    />
                    {invite.email && !isValidEmail(invite.email) && (
                      <p className="mt-1 text-[10px] font-semibold text-rose-600">Enter a valid email address.</p>
                    )}
                  </div>
                  <select
                    value={invite.role}
                    onChange={(event) => updateInvite(invite.id, 'role', event.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-[#f8fafc] px-3 text-[13px]"
                  >
                    <option value="">Select Role</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="KITCHEN">Kitchen</option>
                  </select>
                  <button
                    type="button"
                    disabled={!canSend}
                    onClick={() => sendInvite(invite.id)}
                    className="h-10 rounded-full bg-[#07142a] text-white text-[12px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {invite.status === 'sent' ? '✓ Sent' : 'Send Invite'}
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" onClick={addInviteRow} className="mt-4 text-[13px] font-semibold text-[#1fa8d8]">
            + Add Staff
          </button>
        </div>

        <div className="p-5 sm:p-6 bg-[#fbfdff]">
          <div className="flex items-center gap-2 mb-4">
            <Monitor size={16} className="text-[#59c9ef]" />
            <h2 className="text-[20px] font-bold text-[#111827]">Set Up Your Terminals</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="e.g. Front Counter"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-[13px]"
            />
            <input
              type="text"
              placeholder="e.g. iPad-01"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-[13px]"
            />
            <input
              type="text"
              placeholder="e.g. Drive-Thru"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-[13px]"
            />
            <input
              type="text"
              placeholder="e.g. Pos-Terminal-B"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-[13px]"
            />
          </div>

          <button type="button" className="mt-4 text-[13px] font-semibold text-[#1fa8d8]">
            + Add Terminal
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="flex items-center gap-5">
          <button type="button" onClick={onSkip} className="text-[13px] text-slate-700 font-medium">
            Skip for now
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-11 px-8 rounded-full bg-[#07142a] text-white text-[13px] font-semibold shadow-xl shadow-black/20"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
