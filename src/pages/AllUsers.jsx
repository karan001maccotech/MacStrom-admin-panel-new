import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import axiosInstance from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const columns = [
    { key: "member_id", label: "Sr No." },
    { key: "first_name", label: "Name" },
    { key: "user_name", label: "User Name" },
    { key: "email_id", label: "Email" },
    { key: "mobile_no", label: "Mobile No" },
    { key: "refer_code", label: "Referral No" },
    // { key: "registeredBy", label: "Registered By" },
    // { key: "status", label: "Status" },
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

  const handleEdit = async (row) => {
    const newName = prompt("Enter new name", row.name);
    if (!newName || newName === row.name) return;

    try {
      await axiosInstance.put(`auth/user/${row.id}`, { name: newName });
      toast.success("User updated");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (row) => {
    const confirm = window.confirm(`Delete user: ${row.name}?`);
    if (!confirm) return;

    try {
      await axiosInstance.delete(`auth/admin/user/${row.id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        All Users
      </h1>
      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default UsersPage;
