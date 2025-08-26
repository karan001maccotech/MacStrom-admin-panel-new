import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newName, setNewName] = useState("");

  const columns = [
    { key: "member_id", label: "Sr No." },
    { key: "first_name", label: "Name" },
    { key: "user_name", label: "User Name" },
    { key: "email_id", label: "Email" },
    { key: "mobile_no", label: "Mobile No" },
    { key: "refer_code", label: "Referral No" },
    { key: "actions", label: "Actions" },
  ];

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("auth/user");
      const data = Array.isArray(res.data.users) ? res.data.users : [];
      const formattedUsers = data.map((user, index) => ({
        ...user,
        member_id: index + 1,
      }));
      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---- EDIT ----
  const handleEdit = (row) => {
    setSelectedUser(row);
    setNewName(row.first_name || "");
    setIsEditModalOpen(true);
  };

  const saveEdit = async () => {
    if (!newName || newName === selectedUser.first_name) {
      setIsEditModalOpen(false);
      return;
    }
    try {
      await axiosInstance.put(`auth/user/${selectedUser.id}`, { name: newName });
      toast.success("User updated");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update user");
    }
  };

  // ---- DELETE ----
  const handleDelete = (row) => {
    setSelectedUser(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`auth/admin/user/${selectedUser.id}`);
      toast.success("User deleted");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        All Users
      </h1>
      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ---- Edit Modal ---- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Edit User Name
            </h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              placeholder="Enter new name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Delete Modal ---- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedUser?.first_name}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
