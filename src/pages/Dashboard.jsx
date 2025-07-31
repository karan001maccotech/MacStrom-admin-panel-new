import React from "react";
import { User, Package, Settings } from "lucide-react";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div className="flex min-h-screen p-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={User}
            title="Total Users"
            value="1000"
            to="/users"
          />
          <StatCard
            icon={Package}
            title="Total Orders"
            value="256"
            to="/orders"
          />
          <StatCard
            icon={Settings}
            title="Settings"
            value="3 Active"
            to="/settings"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
