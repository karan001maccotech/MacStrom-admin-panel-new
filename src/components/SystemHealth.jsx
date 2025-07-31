import React from "react";
import { Cpu, Database, Server, ActivitySquare, Crown } from "lucide-react";

// Tailwind color styles for statuses
const getStatusTheme = (status) => {
  switch (status) {
    case "healthy":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
        label: "Healthy"
      };
    case "warning":
      return {
        bg: "bg-orange-100",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-700",
        label: "Warning"
      };
    case "critical":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        badge: "bg-red-100 text-red-600",
        label: "Critical"
      };
    case "db":
      return {
        bg: "bg-purple-100",
        text: "text-purple-700",
        badge: "bg-purple-200 text-purple-800",
        label: "DB"
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        badge: "bg-gray-200 text-gray-800",
        label: "Unknown"
      };
  }
};

const metrics = [
  {
    title: "CPU Usage",
    value: "0.0%",
    status: "healthy",
    icon: Cpu
  },
  {
    title: "Memory Usage",
    value: "0.0%",
    status: "healthy",
    icon: Database
  },
  {
    title: "DB Connections",
    value: "0/100",
    status: "db",
    icon: Database
  },
  {
    title: "Redis Hit Rate",
    value: "0.0%",
    status: "critical",
    icon: Server
  }
];

export default function SystemHealth() {
  const perf = {
    avgResponse: "0ms",
    p95Response: "0ms",
    errorRate: "0%"
  };

  const net = {
    inbound: "1.2 GB/s",
    outbound: "0.8 GB/s",
    disk: "0%"
  };

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
       <div className="p-6 bg-white rounded-2xl shadow border max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <ActivitySquare className="text-purple-700" />
          System Health Monitor
        </div>
        <div className="text-gray-400 text-sm font-medium mt-1">
          Data source: Prometheus /metrics via Grafana API
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {metrics.map((metric) => {
          const statusTheme = getStatusTheme(metric.status);
          const Icon = metric.icon;

          return (
            <div
              key={metric.title}
              className={`rounded-lg p-5 shadow-sm border flex flex-col justify-between ${statusTheme.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`${statusTheme.text} w-6 h-6`} />
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ml-2 ${statusTheme.badge}`}
                >
                  {statusTheme.label}
                </span>
              </div>
              <div className="font-bold text-2xl text-black">{metric.value}</div>
              <div className="text-gray-500 mt-1 mb-2 text-sm">
                {metric.title}
              </div>
              <div className="w-full h-2 rounded-full bg-white mt-2">
                <div className="h-2 rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="font-semibold mb-2 text-gray-800">Performance Metrics</div>
          <div className="rounded-xl bg-white border shadow-sm p-5 space-y-2">
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">API Response Time (avg)</span>
              <span className="font-medium">{perf.avgResponse}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">API Response Time (p95)</span>
              <span className="font-medium">{perf.p95Response}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-medium">{perf.errorRate}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-2 text-gray-800">Network & Storage</div>
          <div className="rounded-xl bg-white border shadow-sm p-5 space-y-2">
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">Network Inbound</span>
              <span className="font-medium">{net.inbound}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">Network Outbound</span>
              <span className="font-medium">{net.outbound}</span>
            </div>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-600">Disk Usage</span>
              <span className="font-medium">{net.disk}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
}
