import { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  ShieldCheck,
  Crown,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import axiosInstance from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [editPermissionsModal, setEditPermissionsModal] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingIsActive, setEditingIsActive] = useState(true);
  const [editingPermissions, setEditingPermissions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

  const allPermissions = [
    "user_management",
    "content_management",
    "gameplay_management",
    "transaction_access",
  ]; // add as needed

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Admin",
    permissions: [],
  });

  const token = localStorage.getItem("authToken");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/admin/getadmins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleViewPermissions = (permissions) => {
    setSelectedPermissions(permissions?.length ? permissions : []);
    setShowPermissionsModal(true);
  };

  const togglePermission = (permission) => {
    setEditingPermissions((prev) =>
      prev.map((p) =>
        p.permission === permission ? { ...p, granted: !p.granted } : p
      )
    );
  };

  const submitEditPermissions = async () => {
    const updatedAdmin = {
      name: editingName,
      isActive: editingIsActive,
      permissions: editingPermissions,
    };

    try {
      await axiosInstance.put(
        `/auth/admin/updateadmin/${editingAdminId}`,
        updatedAdmin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Admin updated successfully");
      setEditPermissionsModal(false);
      setEditingAdminId(null);
      fetchAdmins();
    } catch (error) {
      toast.error("Failed to update admin");
      console.error("Update error:", error);
    }
  };

  const handleEditPermissions = (admin) => {
    setEditingAdminId(admin.id);
    setEditingName(admin.name || "");
    setEditingIsActive(admin.isActive ?? true);

    const perms = (admin.permissions || []).map((p) => ({
      permission: p.permission,
      granted: p.granted,
    }));
    setEditingPermissions(perms);
    setSelectedAdmin(admin);
    setEditPermissionsModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!adminToDelete) return;

    try {
      await axiosInstance.delete(
        `/auth/admin/deleteadmin/${adminToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Admin deleted successfully");
      setShowDeleteModal(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete admin");
    }
  };

  if (loading) return <h1>loading....</h1>;

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 text-gray-900 min-h-screen dark:bg-zinc-900 dark:text-white">
      <ToastContainer />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Crown className="text-purple-800 w-6 h-6" />
            Super Admin Panel
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Deep system oversight and administrative controls
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:border-zinc-600"
          >
            ➕ Create Admin
          </button>
          <button
            onClick={fetchAdmins}
            className="flex items-center gap-1 text-sm border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 dark:border-zinc-600"
          >
            <RefreshCcw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg border dark:border-zinc-700 p-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Admin Management
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Data source: <code>Admins</code>, <code>admin_permissions</code>{" "}
          tables
        </p>

        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-gray-50 dark:bg-zinc-700 p-4 rounded border dark:border-zinc-600 shadow-sm flex justify-between flex-wrap items-center mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-zinc-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{admin.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {admin.role}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {admin.email}
                </div>
                <div
                  className="text-xs text-gray-400 dark:text-gray-300"
                  title={
                    admin.lastLogin
                      ? formatDate(admin.lastLogin)
                      : formatDate(admin.createdAt)
                  }
                >
                  {admin.lastLogin
                    ? `Last login: ${getRelativeTime(admin.lastLogin)}`
                    : `Created on: ${getRelativeTime(admin.createdAt)}`}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center m-5 gap-4 text-sm">
              <button
                onClick={() => handleViewPermissions(admin.permissions)}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {admin.permissions?.length > 0
                  ? "Permissions"
                  : "No permissions"}
              </button>

              <Eye
                className="w-4 h-4 cursor-pointer text-gray-600 hover:text-black dark:hover:text-white"
                onClick={() => {
                  setSelectedAdmin(admin);
                  setIsViewOpen(true);
                }}
              />
              <Pencil
                className={`w-4 h-4 cursor-pointer ${
                  admin.status === "Banned"
                    ? "text-gray-400 opacity-50 cursor-not-allowed"
                    : "text-blue-500 hover:text-blue-700"
                }`}
                onClick={() => {
                  if (admin.status !== "Banned") {
                    handleEditPermissions(admin);
                  }
                }}
              />

              <Trash2
                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => {
                  setAdminToDelete(admin);
                  setShowDeleteModal(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {isViewOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 dark:text-white p-6 rounded-lg shadow-md w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">View Admin Details</h2>
            <div className="mb-3">
              <strong>Name:</strong> {selectedAdmin.name}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {selectedAdmin.email}
            </div>
            <div className="mb-3">
              <strong>Role:</strong> {selectedAdmin.role}
            </div>

            <div className="mb-3">
              <strong>Activity:</strong>{" "}
              <span
                title={
                  selectedAdmin.lastLogin
                    ? formatDate(selectedAdmin.lastLogin)
                    : formatDate(selectedAdmin.createdAt)
                }
              >
                {selectedAdmin.lastLogin
                  ? `Last login: ${getRelativeTime(selectedAdmin.lastLogin)}`
                  : `Created on: ${getRelativeTime(selectedAdmin.createdAt)}`}
              </span>
            </div>

            <div className="mb-3">
              <strong>Permissions:</strong>
              <ul className="list-disc pl-5 text-sm mt-1">
                {(selectedAdmin.permissions || []).map((perm, i) => (
                  <li key={i}>
                    {perm.permission} - {perm.granted ? "Granted" : "Revoked"}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 dark:text-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Create New Admin</h2>

            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, name: e.target.value })
              }
              className="border dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white w-full mb-3 px-2 py-1 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="border dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white w-full mb-3 px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={newAdmin.phone}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, phone: e.target.value })
              }
              className="border dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white w-full mb-3 px-2 py-1 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="border dark:border-zinc-600 bg-white dark:bg-zinc-700 text-black dark:text-white w-full mb-3 px-2 py-1 rounded"
            />

            <label className="block font-medium mb-1">Permissions:</label>
            {["user_management", "content_management", "settings_access"].map(
              (perm) => {
                const existing = newAdmin.permissions.find(
                  (p) => p.permission === perm
                );
                return (
                  <label key={perm} className="block text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={existing?.granted || false}
                      onChange={(e) => {
                        const updated = [...newAdmin.permissions];
                        const index = updated.findIndex(
                          (p) => p.permission === perm
                        );

                        if (index !== -1) {
                          updated[index].granted = e.target.checked;
                        } else {
                          updated.push({
                            permission: perm,
                            granted: e.target.checked,
                          });
                        }

                        setNewAdmin({ ...newAdmin, permissions: updated });
                      }}
                    />
                    {perm.replace(/_/g, " ").toUpperCase()}
                  </label>
                );
              }
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-300 dark:bg-zinc-600 px-3 py-1 rounded"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={async () => {
                  if (
                    !newAdmin.name ||
                    !newAdmin.email ||
                    !newAdmin.phone ||
                    !newAdmin.password
                  ) {
                    toast.error("Please fill in all fields");
                    return;
                  }

                  const allPermissions = [
                    "user_management",
                    "content_management",
                    "settings_access",
                  ];
                  const selectedPermissions = newAdmin.permissions
                    .filter((p) => p.granted)
                    .map((p) => p.permission);

                  const payload = {
                    name: newAdmin.name,
                    email: newAdmin.email,
                    phone: newAdmin.phone,
                    password: newAdmin.password,
                    role: newAdmin.role,
                    permissions: allPermissions.map((p) => ({
                      permission: p,
                      granted: selectedPermissions.includes(p),
                    })),
                  };

                  try {
                    await axiosInstance.post(
                      "/auth/admin/createadmin",
                      payload,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    toast.success("Admin created successfully!");
                    fetchAdmins();
                    setIsCreateOpen(false);
                    setNewAdmin({
                      name: "",
                      email: "",
                      phone: "",
                      password: "",
                      permissions: [],
                    });
                  } catch (err) {
                    toast.error("Failed to create admin");
                  }
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Admin Permissions
            </h2>
            {selectedPermissions.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200">
                {selectedPermissions.map((perm, idx) => (
                  <li key={idx}>
                    {perm.permission.replace(/_/g, " ")}{" "}
                    <span
                      className={
                        perm.granted
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }
                    >
                      : {perm.granted ? "Granted" : "Revoked"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No permissions assigned.
              </p>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {editPermissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Edit Admin Details
            </h2>

            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Name:
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </label>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Permissions:
              </h3>
              <div className="grid gap-2">
                {editingPermissions.map((perm, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={perm.granted}
                      onChange={() => togglePermission(perm.permission)}
                    />
                    {perm.permission.replace(/_/g, " ")}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditPermissionsModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitEditPermissions}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{adminToDelete?.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
