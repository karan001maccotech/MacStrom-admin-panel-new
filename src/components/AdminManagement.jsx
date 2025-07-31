import { User2, Eye, Pencil, LogOut, Ban, Crown } from "lucide-react";
import Pagination from "./Pagination";
import { useState } from "react";

const adminData = [
  {
    name: "Nikhil Lathigara",
    email: "superadmin@battlenation.com",
    role: "SuperAdmin",
    status: "active",
    online: true,
    lastLogin: "1/8/2024, 8:02:15 PM",
    ip: "192.168.3.100",
    location: "Jalgaon, India",
    device: "Chrome 120.0 on Windows 11",
    permissions: 16,
  },
  {
    name: "Mukul Tyagi",
    email: "admin@battlenation.com",
    role: "Admin",
    status: "active",
    online: false,
    lastLogin: "1/7/2024, 3:15:22 PM",
    ip: "192.168.8.22",
    location: "Delhi, India",
    device: "Edge 119.0 on Windows 10",
    permissions: 11,
  },
  {
    name: "Karan Kumar",
    email: "moderator@battlenation.com",
    role: "Moderator",
    status: "active",
    online: true,
    lastLogin: "1/8/2024, 4:52:33 PM",
    ip: "172.16.0.23",
    location: "Delhi, India",
    device: "Firefox 121.0 on Ubuntu",
    permissions: 5,
  },
];

const roleStyles = {
  SuperAdmin: "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Moderator: "bg-green-100 text-green-700",
};

export default function AdminManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(adminData.length / itemsPerPage);

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
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-zinc-800">
            <User2 className="text-violet-500" />
            Admin Management
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Data source: admins, admin_permissions tables
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminData
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((admin) => (
              <div
                key={admin.email}
                className="bg-gray-50 border border-gray-200 max-w-lg rounded-xl p-6 shadow hover:shadow-md transition-shadow"
              >
                {/* Top: Profile and Status */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                      {admin.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          roleStyles[admin.role] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {admin.role}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black text-white">
                        {admin.status}
                      </span>
                      {admin.online && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle: Contact & Login Info */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <div className="font-semibold mb-1 text-gray-800">
                      Contact
                    </div>
                    <p>{admin.email}</p>
                    <p>{admin.location}</p>
                    <p>{admin.device}</p>
                  </div>
                  <div>
                    <div className="font-semibold mb-1 text-gray-800">
                      Login Details
                    </div>
                    <p>Last login: {admin.lastLogin}</p>
                    <p>IP Address: {admin.ip}</p>
                  </div>
                </div>

                {/* Bottom: Permissions and Actions */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span>{admin.permissions} Permissions</span>
                    <Eye
                      className="w-5 h-5 cursor-pointer hover:text-blue-600"
                      title="View Permissions"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      title="Edit"
                      className="p-2 rounded hover:bg-blue-100 transition"
                    >
                      <Pencil className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      title="Log Out"
                      className="p-2 rounded hover:bg-orange-100 transition"
                    >
                      <LogOut className="w-5 h-5 text-orange-600" />
                    </button>
                    <button
                      title="Disable"
                      className="p-2 rounded hover:bg-red-100 transition"
                    >
                      <Ban className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
