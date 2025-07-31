// AuditLogViewer.jsx
import React, { useState, useMemo } from "react";
import { FileUser, FileSpreadsheet, Search, Crown } from "lucide-react";
import Pagination from "./Pagination"; // Assuming you have a Pagination component

// Theme for severity
const SEVERITY_THEME = {
  Critical: "bg-red-100 text-red-600",
  High: "bg-orange-100 text-orange-600",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const Logs = [
  {
    severity: "Critical",
    title: "DATABASE RESET",
    message: "Production database reset initiated during maintenance window.",
    admin: "Devansh Patel",
    resource: "db:prod:reset",
    ip: "203.0.113.45",
    userAgent: "Chrome 124.0",
    timestamp: "7/21/2025, 02:14:36 AM",
  },
  {
    severity: "High",
    title: "USER DELETED",
    message: "Deleted user ShadowKiller99 for multiple policy violations.",
    admin: "Ananya Mehta",
    resource: "user:98765",
    ip: "192.168.10.50",
    userAgent: "Edge 122.0",
    timestamp: "7/20/2025, 07:49:21 PM",
  },
  {
    severity: "Medium",
    title: "TOURNAMENT UPDATED",
    message: "Changed schedule of BGMI Pro League to 23rd July.",
    admin: "Rajveer Singh",
    resource: "tournament:BGMI2025",
    ip: "10.10.1.1",
    userAgent: "Firefox 124.0",
    timestamp: "7/20/2025, 12:37:58 PM",
  },
  {
    severity: "Low",
    title: "SYSTEM CHECK",
    message: "Routine system health check completed successfully.",
    admin: "Nidhi Sharma",
    resource: "system:monitor",
    ip: "172.16.50.12",
    userAgent: "Safari 17.3",
    timestamp: "7/19/2025, 09:00:12 AM",
  },
  {
    severity: "High",
    title: "PAYOUT DECLINED",
    message: "Declined payout request due to mismatch in transaction details.",
    admin: "Ishaan Roy",
    resource: "payout:6523",
    ip: "192.168.30.45",
    userAgent: "Chrome 125.0",
    timestamp: "7/19/2025, 04:27:40 PM",
  },
  {
    severity: "Medium",
    title: "NEW ADMIN ADDED",
    message: "Granted admin access to user: NehaTourney",
    admin: "Devansh Patel",
    resource: "admin:permissions",
    ip: "203.0.113.99",
    userAgent: "Brave 1.70.0",
    timestamp: "7/18/2025, 11:15:29 AM",
  },
  {
    severity: "Critical",
    title: "SERVER DOWNTIME",
    message: "Matchmaking service was offline for 12 minutes due to overload.",
    admin: "Raghav Goel",
    resource: "server:mm-service",
    ip: "198.51.100.77",
    userAgent: "Chrome 126.0",
    timestamp: "7/17/2025, 06:58:10 AM",
  },
];

// All possible severities
const ALL_SEVERITIES = ["All Severity", "Critical", "High", "Medium", "Low"];

function downloadCSV(rows, filename = "audit_log.csv") {
  const header = [
    "Severity",
    "Title",
    "Message",
    "Admin",
    "Resource",
    "IP",
    "UserAgent",
    "Timestamp",
  ];
  const csvRows = [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((col) => `"${(r[col.toLowerCase()] || "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = filename;
  link.click();
}

export default function AuditLogViewer() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All Severity");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return Logs.filter((log) => {
      const matchSeverity =
        severity === "All Severity" || log.severity === severity;
      const matchSearch =
        !search ||
        log.title.toLowerCase().includes(search.toLowerCase()) ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.admin.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [search, severity]);

  // CSV rows: lowercased keys for easier mapping
  const csvRows = filteredLogs.map((r) => ({
    severity: r.severity,
    title: r.title,
    message: r.message,
    admin: r.admin,
    resource: r.resource,
    ip: r.ip,
    useragent: r.userAgent,
    timestamp: r.timestamp,
  }));

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
       <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileUser className="w-7 h-7 text-blue-600" />
          <span className="font-extrabold text-2xl">Audit Log Viewer</span>
        </div>
        <button
          className="flex items-center border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm hover:bg-gray-50 gap-2"
          onClick={() => downloadCSV(csvRows)}
        >
          <FileSpreadsheet className="w-5 h-5 text-green-700" />
          <span className="font-semibold text-sm text-gray-800">Export CSV</span>
        </button>
      </div>
      <div className="text-gray-400 text-sm mb-4">Data source: admin_audit table</div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={search}
            placeholder="Search by admin, action, or details..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-4 py-2 bg-white focus:ring-blue-200 outline-none"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {ALL_SEVERITIES.map((sev) => (
            <option value={sev} key={sev}>
              {sev}
            </option>
          ))}
        </select>
      </div>

      {/* Logs as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-400 py-12 col-span-full">
            No log entries found.
          </div>
        ) : (
          filteredLogs
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((log, idx) => (
              <div
                key={idx}
                className="bg-gray-100 border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="font-bold uppercase tracking-wide text-base text-gray-800">
                      {log.title}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        SEVERITY_THEME[log.severity] || "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{log.message}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>
                      <span className="font-semibold">Admin:</span> {log.admin}
                    </div>
                    <div>
                      <span className="font-semibold">Resource:</span> {log.resource}
                    </div>
                    <div>
                      <span className="font-semibold">IP:</span> {log.ip}
                    </div>
                    <div>
                      <span className="font-semibold">User Agent:</span> {log.userAgent}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-4 text-right">{log.timestamp}</div>
              </div>
            ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>

    </div>
  );
}
