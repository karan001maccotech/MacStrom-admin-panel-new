import { ArrowDownLeft, ArrowUpRight, Crown, DollarSign } from "lucide-react";
import React, { useState } from "react";
const dateOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];


const StatCard = ({ Icon, title, value, growth, color, bgColor, textColor }) => (
  <div className={`rounded-2xl p-6 shadow-sm text-center ${bgColor}`}>
    <Icon className={`w-8 h-8 mx-auto ${color}`} />
    <div className={`mt-2 font-medium ${textColor}`}>{title}</div>
    <div className={`text-3xl font-bold ${textColor}`}>${value.toLocaleString()}</div>
    {growth !== null && (
      <div className={`text-sm flex justify-center items-center gap-1 ${color}`}>
        {growth > 0 ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownLeft className="w-4 h-4" />
        )}
        {growth > 0 ? "+" : ""}
        {growth.toFixed(2)}%
      </div>
    )}
  </div>
);



function PnL() {
  const [dateFilter, setDateFilter] = useState(dateOptions[0].value);

  const revenue = 45230;
  const costs = 28940;
  const profit = 16290;
  const revenueGrowth = 8.5;
  const costsGrowth = 12.3;
  const profitMargin = 36;

  return (
    <>


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
            {/* P&L Section */}
      <div className="bg-white rounded-2xl shadow p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800">
              💰 Profit & Loss Overview
            </h2>
            <p className="text-sm text-zinc-400">
              Data source: <code>pl_summary_daily</code>
            </p>
          </div>
          <select
            className="px-3 py-2 border-2 border-violet-500 rounded-lg font-medium text-sm text-violet-700 focus:outline-none"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            Icon={DollarSign}
            title="Total Revenue"
            value={revenue}
            growth={revenueGrowth}
            color="text-green-600"
            bgColor="bg-green-50"
            textColor="text-green-800"
          />
          <StatCard
            Icon={ArrowDownLeft}
            title="Total Costs"
            value={costs}
            growth={costsGrowth}
            color="text-red-600"
            bgColor="bg-red-50"
            textColor="text-red-800"
          />
          <div className="rounded-2xl p-6 shadow-sm text-center bg-purple-50">
            <ArrowUpRight className="w-8 h-8 mx-auto text-purple-600" />
            <div className="mt-2 font-medium text-purple-700">Net Profit</div>
            <div className="text-3xl font-bold text-purple-900">
              ${profit.toLocaleString()}
            </div>
            <div className="text-sm text-purple-500">
              {profitMargin}% margin
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default PnL;
