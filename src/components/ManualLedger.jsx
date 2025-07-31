// ManualLedger.jsx
import React, { useState } from "react";
import {
  DollarSign,
  Clock,
  Lock,
  Plus,
  CheckCircle2,
  X,
  Crown,
} from "lucide-react";
import { toast } from "react-toastify";

// Color theme
const THEME = {
  blue: "bg-blue-50 text-blue-700",
  gold: "bg-yellow-50 text-yellow-700",
  section: "bg-white",
  card: "rounded-xl shadow-sm border border-gray-200",
  formSection: "rounded-xl border border-gray-200 bg-white",
  blackBtn: "bg-black text-white hover:bg-gray-900",
  border: "border border-gray-100",
};

export default function ManualLedger() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo values
  const currentBalance = 978245.99;
  const pendingTransactions = 13265;
  const lastAdjustment = {
    amount: "+500.00",
    type: "Credit",
    reason: "Tournament prize correction",
    admin: "Nikhil Lathigara",
    time: "1/8/2024, 4:52:33 PM",
  };

  function handleCancel() {
    setShowForm(false);
    setAmount("");
    setReason("");
    setPin("");
  }

  function handleConfirm(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate request
    setTimeout(() => {
      setLoading(false);
      setShowForm(false);
      setAmount("");
      setReason("");
      setPin("");
toast.success("Ledger adjustment submitted successfully!");
    }, 1200);
  }

  return (


     <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-violet-600">
            <Crown className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-zinc-800">
              Super Admin Dashboard
            </h1>
          </div>
          <p className="text-sm text-zinc-500">
            Deep system oversight and administrative controls
          </p>
        </div>
      </div>
          <div className="space-y-6">

      {/* Platform Ledger Status Card */}
      <section className={`${THEME.section} ${THEME.card} p-6`}>
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-6 h-6 text-blue-700" />
          <span className="font-bold text-xl">Platform Ledger Status</span>
        </div>
        <div className="text-gray-400 text-xs mb-5">
          Data source: platform_earnings table
        </div>
        {/* Balance Cards */}
        <div className="flex flex-col sm:flex-row gap-5 mb-5 transition">
          <div className={`flex-1 flex flex-col items-center justify-center h-32 ${THEME.blue} ${THEME.card}`}>
            <DollarSign className="w-8 h-8 mb-2 text-blue-400" />
            <div className="text-base text-blue-700 opacity-90 mb-1">Current Balance</div>
            <div className="font-bold text-3xl tracking-tight">${currentBalance.toLocaleString()}</div>
          </div>
          <div className={`flex-1 flex flex-col items-center justify-center h-32 ${THEME.gold} ${THEME.card}`}>
            <Clock className="w-8 h-8 mb-2 text-yellow-400" />
            <div className="text-base text-yellow-700 opacity-90 mb-1">Pending Transactions</div>
            <div className="font-bold text-3xl tracking-tight">${pendingTransactions.toLocaleString()}</div>
          </div>
        </div>
        {/* Last Manual Adjustment */}
        <div className="bg-gray-50 rounded-lg p-4 border mt-3">
          <div className="font-medium mb-2 text-gray-800">Last Manual Adjustment</div>
          <div className="flex flex-col md:flex-row md:justify-between gap-3">
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div>
                <div className="text-gray-500">Amount:</div>
                <div className="font-semibold">{lastAdjustment.amount}</div>
              </div>
              <div>
                <div className="text-gray-500">Type:</div>
                <div className="font-semibold">{lastAdjustment.type}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500">Reason:</div>
                <div className="font-semibold">{lastAdjustment.reason}</div>
              </div>
            </div>
            <div className="flex-1 gap-2 grid grid-cols-2 text-sm">
              <div>
                <div className="text-gray-500">Admin:</div>
                <div className="font-semibold">{lastAdjustment.admin}</div>
              </div>
              <div>
                <div className="text-gray-500">Time:</div>
                <div className="font-semibold">{lastAdjustment.time}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manual Ledger Adjustment Card */}
      <section className={`${THEME.section} ${THEME.card} p-6`}>
        <div className="flex items-center mb-1 gap-2">
          <Lock className="w-5 h-5 text-gray-700" />
          <span className="font-bold text-lg">Manual Ledger Adjustment</span>
        </div>
        <div className="text-gray-400 text-sm mb-5">
          Requires PIN verification. All changes are logged and audited.
        </div>
        
        {/* Form Toggle / Form */}
        {!showForm ? (
          <button
            className={`w-full flex items-center justify-center gap-2 rounded-lg transition ${THEME.blackBtn} py-3 mt-2 text-base font-semibold`}
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-5 h-5" /> Make Ledger Adjustment
          </button>
        ) : (
          <form
            className={`transition-all overflow-hidden space-y-6
              ${THEME.formSection} p-6 mt-0`}
            onSubmit={handleConfirm}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="text-[15px] font-medium mb-1">Adjustment Amount</div>
                <input
                  type="number"
                  value={amount}
                  step="0.01"
                  required
                  placeholder="Enter amount (+ for credit, - for debit)"
                  onChange={e => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-base focus:ring-blue-200 focus:border-blue-400 outline-none"
                />
              </div>
              <div>
                <div className="text-[15px] font-medium mb-1">Security PIN</div>
                <input
                  type="password"
                  value={pin}
                  required
                  maxLength={12}
                  placeholder="Enter your PIN"
                  onChange={e => setPin(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-base focus:ring-blue-200 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="text-[15px] font-medium mb-1">Reason for Adjustment</div>
              <input
                type="text"
                value={reason}
                required
                placeholder="Provide detailed reason for this adjustment"
                onChange={e => setReason(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-base focus:ring-blue-200 focus:border-blue-400 outline-none"
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex justify-center items-center gap-2 rounded-lg px-4 py-3 font-semibold text-base ${THEME.blackBtn} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <CheckCircle2 className="w-5 h-5" /> 
                {loading ? "Submitting..." : "Confirm Adjustment"}
              </button>
              <button 
                type="button"
                disabled={loading}
                className="flex-1 flex justify-center items-center gap-2 rounded-lg px-4 py-3 border border-gray-200 text-base font-semibold
                bg-gray-50 hover:bg-gray-100 text-gray-700"
                onClick={handleCancel}
              >
                <X className="w-5 h-5" /> Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
    </div>
  );
}
