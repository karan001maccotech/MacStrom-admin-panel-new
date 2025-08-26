import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Image,
  ImageIcon,
  LayoutDashboard,
  Settings,
  User,
  DollarSign,
  AlertTriangle,
  Bell,
  ClipboardList,
  Headphones,
  Crown,
  Monitor,
  ThumbsUp,
  Gift,
  Sword,
  Users as UsersIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";


const menuItems = [
  {
    label: "Super Admin Panel",
    icon: Crown,
    path: "/super-admin-panel",
    submenuKey: "super-admin",
    subItems: [
      { label: "P&L Overview", path: "/p&l-overview" },
      { label: "Admin Management", path: "/admin-management" },
      { label: "System Health", path: "/system-health" },
      { label: "Audit Log Viewer", path: "/audit-log" },
      { label: "Manual Ledger", path: "/manual-ledger" },
    ],
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Users",
    icon: User,
    submenuKey: "users",
    subItems: [
      { label: "All Users", path: "/users" },
      { label: "User Settings", path: "/user-settings" },
      { 
        label: "User KYC", 
        path: "/user-kyc",
        submenuKey: "userKyc",
        subItems: [
          { label: "KYC", path: "/kyc" }, 
        ]  
      },
      { label: "User Teams", path: "/user-teams" },
      { label: "All Withdraw", path: "/all-withdraw" },
    ],
  },
  {
    label: "Teams",
    icon: UsersIcon,
    submenuKey: "teams",
    subItems: [{ label: "All Teams", path: "/teams" }],
  },
   {
    label: "Daily Duels",
    icon: Sword,
    path: "/admin/duels",
  },
    {
    label: "Images", // ✅ NEW
    icon: ImageIcon,   // (You can replace with a better one if needed)
    path: "/admin/images",
  },

  {
    label: "Games",
    icon: Gamepad2,
    submenuKey: "games",
    subItems: [
      { label: "All Games", path: "/games" },
      { label: "Matches", path: "/matches" },
      { label: "Contest" , subItems: [
          { label: "Solo", path: "/solo" },
         { label: "Duo Contests", path: "/duoContests" },
          { label: "Squad", path: "/squad" },
        ] },
    ],
  },

  {
    label: "Sponsor Ads",
    icon: Monitor,
    path: "/admin/ads",
  },
  // {
  //   label: "Problem Center",
  //   icon: AlertTriangle,
  //   submenuKey: "problemCenter",
  //   subItems: [{ label: "Problems", path: "/admin/problemcenter" }],
  // },
  {
    label: "Notification Center",
    icon: Bell,
    submenuKey: "notificationCenter",
    subItems: [{ label: "Notification", path: "/admin/notificationcenter" }],
  },
    {
    label: "Refral & Rewards",
    icon: Gift,
    path: "/refral-rewards",
  },
  {
    label: "Reports",
    icon: ClipboardList,
    submenuKey: "reports",
    subItems: [
      {
        label: "Problem & Reports",
        path: "/Reportss",
      },
    ],
  },
  {
    label: "Support Desk",
    icon: Headphones,
    path: "/support",
  },
  {
    label: "Setting",
    icon: Settings,
    path: "/settings",
  },
  {
    label: "Bonus",
    icon: Gift,
    path: "/bonus",
  },
 {
    label: "Gift Card Store",
    icon: Gift,
    path: "/gift-card",
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMenuItem = (item, depth = 0) => {
    const Icon = item.icon;
    const isSubmenuOpen = openMenus[item.submenuKey];
    const marginClass = depth > 0 ? `ml-${depth * 5}` : '';

    // If item has both path and subItems (like User KYC)
    if (item.path && item.subItems) {
      return (
        <div key={item.label}>
          <div className="flex">
            <Link
              to={item.path}
              className={`flex-1 p-2 rounded-l hover:bg-zinc-300 dark:hover:bg-zinc-700 ${marginClass} ${
                location.pathname === item.path
                  ? "text-primary-600 font-medium bg-zinc-300 dark:bg-zinc-700"
                  : ""
              }`}
            >
              {item.label}
            </Link>
            <button
              onClick={() => toggleMenu(item.submenuKey)}
              className="p-2 rounded-r hover:bg-zinc-300 dark:hover:bg-zinc-700 border-l border-zinc-400 dark:border-zinc-600"
            >
              {isSubmenuOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          </div>
          {isSubmenuOpen && (
            <div className="ml-5 my-2 space-y-1">
              {item.subItems.map((sub) => renderMenuItem(sub, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // If item has only subItems (expandable menu)
    if (item.subItems) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.submenuKey)}
            className={`flex w-full items-center justify-between p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 border-b dark:border-zinc-700 ${marginClass}`}
          >
            <span className="flex items-center space-x-2">
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
            </span>
            {isSubmenuOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          {isSubmenuOpen && (
            <div className="ml-5 my-2 space-y-1">
              {item.subItems.map((sub) => renderMenuItem(sub, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Regular link item
    return (
      <Link
        key={item.label}
        to={item.path}
        className={`block p-3 rounded hover:text-primary-500 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${marginClass} ${
          location.pathname === item.path
            ? "text-primary-600 font-medium bg-zinc-300 dark:bg-zinc-700"
            : ""
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <aside className=" overflow-y-auto w-64 bg-green-50 dark:bg-zinc-800 text-zinc-800 dark:text-white border-r dark:border-zinc-700 min-h-screen">
      <div className="p-4 text-2xl font-bold">
        Battle <span className="text-green-600">Nation</span>{" "}
        <span className="text-green-800">Admin</span>
      </div>
      <nav className="px-4 space-y-3 my-2 text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSubmenuOpen = openMenus[item.submenuKey];

          // Handle items with both path and subItems (like User KYC)
          if (item.path && item.subItems) {
            return (
              <div key={item.label}>
                <div className="flex">
                  <Link
                    to={item.path}
                    className={`flex-1 flex items-center space-x-2 p-2 rounded-l hover:bg-zinc-300 dark:hover:bg-zinc-700 ${
                      location.pathname === item.path
                        ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                        : ""
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </Link>
                  <button
                    onClick={() => toggleMenu(item.submenuKey)}
                    className="p-2 rounded-r hover:bg-zinc-300 dark:hover:bg-zinc-700 border-l border-zinc-400 dark:border-zinc-600"
                  >
                    {isSubmenuOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </div>
                {isSubmenuOpen && (
                  <div className="ml-5 my-2 space-y-1">
                    {item.subItems.map((sub) => renderMenuItem(sub, 0))}
                  </div>
                )}
              </div>
            );
          }

          // Handle items with only subItems
          if (item.subItems) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.submenuKey)}
                  className="flex w-full items-center justify-between p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 border-b dark:border-zinc-700"
                >
                  <span className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </span>
                  {isSubmenuOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {isSubmenuOpen && (
                  <div className="ml-5 my-2 space-y-1">
                    {item.subItems.map((sub) => renderMenuItem(sub, 0))}
                  </div>
                )}
              </div>
            );
          }

          // Handle regular links
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 ${
                location.pathname === item.path
                  ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                  : ""
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
