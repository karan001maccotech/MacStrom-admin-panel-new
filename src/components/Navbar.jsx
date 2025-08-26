import React, { useEffect, useRef, useState } from "react";
import { Menu, User, Edit2, Save, X } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getInitials = (first, last) => {
  const name = `${first || ""} ${last || ""}`.trim();
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
};

const ProfileModal = ({
  open,
  onClose,
  profileData,
  setProfileData,
  onSave,
  saving,
}) => {
  if (!open) return null;

  const onField = (key) => (e) =>
    setProfileData((p) => ({ ...p, [key]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generate a preview URL (for UI display only)
    const previewUrl = URL.createObjectURL(file);

    setProfileData((p) => ({
      ...p,
      profile_image: file, // Keep the File object for upload
      profile_image_preview: previewUrl, // Temporary URL for UI
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl mx-2 p-6  relative border border-zinc-200 dark:border-zinc-700">
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            {profileData.profile_image ? (
              <img
                src={profileData.profile_image}
                alt="Avatar"
                className="w-20 h-20 rounded-full border object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border bg-pink-200 text-white flex items-center justify-center font-bold text-5xl">
                {getInitials(profileData.first_name, profileData.last_name)}
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-200 rounded-full p-1 cursor-pointer shadow group-hover:scale-105 transition">
              <Edit2 className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="mt-2 text-lg font-semibold text-zinc-800 dark:text-white">
            Profile
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-zinc-700 dark:text-zinc-200">
              First Name
            </label>
            <input
              className="flex-1 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              value={profileData.first_name || ""}
              onChange={onField("first_name")}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-zinc-700 dark:text-zinc-200">
              Last Name
            </label>
            <input
              className="flex-1 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              value={profileData.last_name || ""}
              onChange={onField("last_name")}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-zinc-700 dark:text-zinc-200">
              Email
            </label>
            <input
              type="email"
              className="flex-1 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              value={profileData.email_id || ""}
              onChange={onField("email_id")}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-zinc-700 dark:text-zinc-200">
              Phone
            </label>
            <input
              className="flex-1 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              value={profileData.mobile_no || ""}
              onChange={onField("mobile_no")}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="w-28 text-sm text-zinc-700 dark:text-zinc-200">
              New Password
            </label>
            <input
              type="password"
              className="flex-1 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none"
              value={profileData.newPassword || ""}
              onChange={onField("newPassword")}
              placeholder="Leave blank to keep"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
            onClick={onSave}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    mobile_no: "",
    profile_image: "",
    newPassword: "",
  });

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // open modal + fetch profile
  const openProfile = async () => {
    setProfileOpen(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        "https://macstormbattle-backend.onrender.com/api/admin/profile/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      setProfileData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email_id: data.email_id || "",
        mobile_no: data.mobile_no || "",
        profile_image: data.profile_image || "", // ✅ just use what backend gives
        newPassword: "",
      });
    } catch (e) {
      console.error(e);
      toast.error("Could not load profile");
    }
  };
  const saveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      let imageUrl = profileData.profile_image; // Existing URL (if no new file)

      // If a new file is selected, upload to S3 first
      if (profileData.profile_image instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", profileData.profile_image);

        const uploadRes = await fetch(
          "https://macstormbattle-backend.onrender.com/api/admin/profile/me",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: uploadFormData,
          }
        );

        if (!uploadRes.ok) throw new Error("Failed to upload image");
        const { url } = await uploadRes.json();
        imageUrl = url; // New S3 URL
      }

      // Now save profile with the updated URL
      const res = await fetch(
        "https://macstormbattle-backend.onrender.com/api/admin/profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email_id: profileData.email_id,
            mobile_no: profileData.mobile_no,
            profile_image: imageUrl, // S3 URL (or existing URL)
            newPassword: profileData.newPassword || undefined,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile updated!");
      setProfileOpen(false);
    } catch (e) {
      toast.error(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // outside click for dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!", { position: "top-center" });
    setTimeout(() => navigate("/login", { replace: true }), 800);
  };

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-zinc-800 border-b dark:border-zinc-700">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700"
        >
          <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        </button>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <DarkModeToggle />
        <span className="text-sm text-zinc-600 dark:text-zinc-300">Admin</span>

        {profileData.profile_image ? (
          <img
            src={profileData.profile_image}
            alt="Avatar"
            className="w-8 h-8 rounded-full border cursor-pointer object-cover"
            onClick={() => setDropdownOpen((p) => !p)}
          />
        ) : (
          <div
            onClick={() => setDropdownOpen((p) => !p)}
            className="w-8 h-8 rounded-full border cursor-pointer bg-pink-200 text-white flex items-center justify-center font-bold text-xl"
          >
            {getInitials(profileData.first_name, profileData.last_name)}
          </div>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 top-12 mt-2 w-44 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                setDropdownOpen(false);
                openProfile();
              }}
              className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-t-lg flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/register");
              }}
              className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white"
            >
              Register
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-red-600 dark:text-red-400 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}

        <ProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          profileData={profileData}
          setProfileData={setProfileData}
          onSave={saveProfile}
          saving={saving}
        />
      </div>
    </header>
  );
};

export default Navbar;
