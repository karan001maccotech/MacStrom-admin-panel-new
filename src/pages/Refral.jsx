import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const ReferralSystem = () => {
  const [referrals, setReferrals] = useState([
    {
      id: 1,
      name: "Referral #1",
      amount: 250,
      expiryDate: new Date("2025-06-15"),
      status: "expired",
    },
    {
      id: 2,
      name: "Referral #2",
      amount: 500,
      expiryDate: new Date("2025-03-20"),
      status: "expired",
    },
    {
      id: 3,
      name: "Referral #3",
      amount: 150,
      expiryDate: new Date("2024-12-10"),
      status: "expired",
    },
    {
      id: 4,
      name: "Referral #4",
      amount: 750,
      expiryDate: new Date("2025-08-30"),
      status: "active",
    },
    {
      id: 5,
      name: "Referral #5",
      amount: 100,
      expiryDate: new Date("2024-11-30"),
      status: "expired",
    },
    {
      id: 6,
      name: "Referral #6",
      amount: 425,
      expiryDate: new Date("2025-07-12"),
      status: "expired",
    },
  ]);

  const [newReferral, setNewReferral] = useState({
    amount: "",
    expiryDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Calculate stats
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === "active").length;
  const expiredReferrals = referrals.filter((r) => r.status === "expired").length;

  const handleCreateReferral = () => {
    if (newReferral.amount && newReferral.expiryDate) {
      const newRef = {
        id: Date.now(),
        name: `Referral #${totalReferrals + 1}`,
        amount: parseFloat(newReferral.amount),
        expiryDate: new Date(newReferral.expiryDate),
        status: new Date(newReferral.expiryDate) > new Date() ? "active" : "expired",
      };

      setReferrals([...referrals, newRef]);
      setNewReferral({ amount: "", expiryDate: "" });
    }
  };

  const handleEditStart = (referral) => {
    setEditingId(referral.id);
    setEditData({
      amount: referral.amount,
      expiryDate: referral.expiryDate.toISOString().split('T')[0],
    });
  };

  const handleEditSave = () => {
    setReferrals(
      referrals.map((ref) =>
        ref.id === editingId
          ? {
              ...ref,
              amount: parseFloat(editData.amount),
              expiryDate: new Date(editData.expiryDate),
              status: new Date(editData.expiryDate) > new Date() ? "active" : "expired",
            }
          : ref,
      ),
    );
    setEditingId(null);
    setEditData({});
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    setReferrals(referrals.filter((ref) => ref.id !== id));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB");
  };

  const StatCard = ({ title, value, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-lg p-6 text-center`}>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
    </div>
  );

  const ReferralCard = ({ referral }) => {
    const isEditing = editingId === referral.id;
    const isExpired = referral.status === "expired";

    if (isEditing) {
      return (
        <div className="bg-white rounded-lg border p-4 h-full">
          <div className="flex items-center mb-4">
            <div className={`w-2 h-2 rounded-full mr-2 ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <h3 className="font-medium">{referral.name}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 mb-1">Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={editData.expiryDate}
                  onChange={(e) => setEditData({ ...editData, expiryDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border p-4 h-full relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <h3 className="font-medium">{referral.name}</h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleEditStart(referral)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(referral.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <DollarSign className="w-4 h-4 mr-1" />
              Amount
            </div>
            <div className="text-xl font-bold">${referral.amount}</div>
          </div>

          <div>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              Expiry Date
            </div>
            <div className="flex items-center gap-2">
              <span className={isExpired ? 'text-red-600' : 'text-gray-900'}>
                {formatDate(referral.expiryDate)}
              </span>
              {isExpired && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                  Expired
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Referral System Header */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Referral System</h3>
                <p className="text-sm text-gray-500">Manage your referral campaigns</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600 font-medium">System Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Create New Referral */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 mb-6">
              <div className="flex items-center mb-6">
                <Plus className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Create New Referral</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={newReferral.amount}
                      onChange={(e) => setNewReferral({ ...newReferral, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-1">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={newReferral.expiryDate}
                      onChange={(e) => setNewReferral({ ...newReferral, expiryDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateReferral}
                  disabled={!newReferral.amount || !newReferral.expiryDate}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Referral
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">All Referrals ({totalReferrals})</h1>
              <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard 
                title="Total Referrals" 
                value={totalReferrals} 
                bgColor="bg-blue-100" 
                textColor="text-blue-600" 
                
              />
              <StatCard 
                title="Active Referrals" 
                value={activeReferrals} 
                bgColor="bg-green-100" 
                textColor="text-green-600" 
              />
              <StatCard 
                title="Expired Referrals" 
                value={expiredReferrals} 
                bgColor="bg-red-100" 
                textColor="text-red-600" 
              />
            </div>

            {/* Active Referrals */}
            {activeReferrals > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Active Referrals ({activeReferrals})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {referrals
                    .filter((ref) => ref.status === "active")
                    .map((referral) => (
                      <ReferralCard key={referral.id} referral={referral} />
                    ))}
                </div>
              </div>
            )}

            {/* Expired Referrals */}
            {expiredReferrals > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Expired Referrals ({expiredReferrals})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {referrals
                    .filter((ref) => ref.status === "expired")
                    .map((referral) => (
                      <ReferralCard key={referral.id} referral={referral} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;