import React from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  summaryStats,
  barData,
  donutData1,
  donutOptions,
  miniLineData,
  divisionData,
  barOptions,
  miniOptions,
  playersActiveData, playersActiveOptions 
} from "../data/users";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* 🟡 Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 shadow flex items-center gap-4"
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Graphs Section */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Bar Chart */}
  <div className="bg-white rounded-2xl p-4 shadow">
    <h3 className="text-lg font-semibold mb-4">Current Week vs Previous Week Revenue</h3>
    <div className="h-64">
      <Bar data={barData} options={barOptions} />
    </div>
  </div>

  {/* Doughnut Chart */}
  <div className="bg-white rounded-2xl p-4 shadow">
    <h3 className="text-lg font-semibold mb-4">Player Type</h3>
    <div className="h-64">
      <Doughnut data={donutData1} options={donutOptions} />
    </div>
  </div>
</div>


      {/* 👥 Lower Section: Line + Mini Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Players Line (Placeholder until you use it) */}
       <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-4">Players Active (Today)</h3>
      <div className="h-64">
        <Line data={playersActiveData} options={playersActiveOptions} />

      </div>
    </div>

        {/* Monthly & Division Cards */}
        <div className="flex flex-col gap-4">
          {/* Monthly Players Card */}
          <div className="bg-blue-100 text-black rounded-2xl p-4 shadow">
            <p className="text-sm">Players this month</p>
            <p className="text-3xl font-bold mb-2">3,240</p>
            <div className="h-24">
              <Line data={miniLineData} options={miniOptions} />
            </div>
          </div>

          {/* Division Breakdown */}
          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-2">Players By Division</h3>
            <ul className="space-y-2 text-sm">
              {divisionData.map((div, i) => (
                <li key={i} className="flex justify-between">
                  <span>{div.name}</span>
                  <span className="font-medium">{div.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
