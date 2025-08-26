import React, { useState } from "react";
import RosterManagementModal from "./RosterManagementModal";
import {
  Plus,
  Download,
  Search,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  BarChart2,
} from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Demo roster data (shared for all teams for now)
  const demoRoster = [
    {
      id: 1,
      name: "Alice",
      avatar: "https://placehold.co/40x40/ffb6b6/333333?text=A",
      role: "Captain",
      isActive: true,
    },
    {
      id: 2,
      name: "Bob",
      avatar: "https://placehold.co/40x40/ffd6a5/333333?text=B",
      role: "Player",
      isActive: true,
    },
    {
      id: 3,
      name: "Charlie",
      avatar: "https://placehold.co/40x40/9ad0ec/333333?text=C",
      role: "Sub",
      isActive: false,
    },
    {
      id: 4,
      name: "Diana",
      avatar: "https://placehold.co/40x40/ffecb3/333333?text=D",
      role: "Player",
      isActive: true,
    },
    {
      id: 5,
      name: "Ethan",
      avatar: "https://placehold.co/40x40/c3ffd9/333333?text=E",
      role: "Sub",
      isActive: false,
    },
    {
      id: 6,
      name: "Fiona",
      avatar: "https://placehold.co/40x40/b3c6ff/333333?text=F",
      role: "Player",
      isActive: true,
    },
    {
      id: 7,
      name: "George",
      avatar: "https://placehold.co/40x40/ffc3e0/333333?text=G",
      role: "Sub",
      isActive: false,
    },
    {
      id: 8,
      name: "Hannah",
      avatar: "https://placehold.co/40x40/e0ffc3/333333?text=H",
      role: "Player",
      isActive: true,
    },
    {
      id: 9,
      name: "Ivan",
      avatar: "https://placehold.co/40x40/c3e0ff/333333?text=I",
      role: "Sub",
      isActive: false,
    },
    {
      id: 10,
      name: "Julia",
      avatar: "https://placehold.co/40x40/ffe0c3/333333?text=J",
      role: "Player",
      isActive: true,
    },
    {
      id: 11,
      name: "Kevin",
      avatar: "https://placehold.co/40x40/e0c3ff/333333?text=K",
      role: "Sub",
      isActive: false,
    },
    {
      id: 12,
      name: "Lily",
      avatar: "https://placehold.co/40x40/c3ffe0/333333?text=L",
      role: "Player",
      isActive: true,
    },
    {
      id: 13,
      name: "Mike",
      avatar: "https://placehold.co/40x40/ffc3c3/333333?text=M",
      role: "Sub",
      isActive: false,
    },
    {
      id: 14,
      name: "Nina",
      avatar: "https://placehold.co/40x40/c3c3ff/333333?text=N",
      role: "Player",
      isActive: true,
    },
    {
      id: 15,
      name: "Oscar",
      avatar: "https://placehold.co/40x40/fffac3/333333?text=O",
      role: "Sub",
      isActive: false,
    },
  ];

  const teams = [
    {
      id: 1,
      name: "Phoenix Warriors",
      avatar: "https://placehold.co/40x40/f0f0f0/888888?text=PW",
      state: "California",
      votesState: 1250,
      votesNational: 3420,
      regUsers: 5,
      roster: demoRoster,
      maxMembers: 15,
    },
    {
      id: 2,
      name: "Thunder Bolts",
      avatar: "https://placehold.co/40x40/e0e0e0/777777?text=TB",
      state: "Texas",
      votesState: 1580,
      votesNational: 4200,
      regUsers: 4,
      roster: demoRoster,
      maxMembers: 15,
    },
    {
      id: 3,
      name: "Shadow Hunters",
      avatar: "https://placehold.co/40x40/d0d0d0/666666?text=SH",
      state: "New York",
      votesState: 890,
      votesNational: 2100,
      regUsers: 5,
      roster: demoRoster,
      maxMembers: 15,
    },
  ];

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // No longer needed: getTeamWithRoster

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      {/* Roster Modal */}
      {showRosterModal && selectedTeam && (
        <RosterManagementModal
          team={selectedTeam}
          onClose={() => {
            setShowRosterModal(false);
            setSelectedTeam(null);
          }}
        />
      )}
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage team rosters, votes, and performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md shadow-sm bg-white hover:bg-gray-100 text-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export Teams
          </button>
          <button className="flex items-center px-4 py-2 bg-black text-white text-sm rounded-md shadow-sm hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {/* Team Directory Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-white gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Team Directory
          </h2>
          <div className="relative w-full max-w-64">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
              size={12}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 placeholder-gray-400 focus:outline-double focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block my-2 p-4 mx-4">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-white text-gray-700 uppercase tracking-wider text-sm font-medium">
              <tr>
                <th className="px-6 py-3 text-left">Team ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">State</th>
                <th className="px-6 py-3 text-left">Votes (State)</th>
                <th className="px-6 py-3 text-left">Votes (National)</th>
                <th className="px-6 py-3 text-left">Reg Users</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {team.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={team.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        {team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{team.state}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">
                    <a
                      href="#"
                      className="flex items-center gap-1 hover:text-blue-800"
                    >
                      <BarChart2 size={16} />
                      {team.votesState.toLocaleString()}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-purple-600 font-medium">
                    <a
                      href="#"
                      className="flex items-center gap-1 hover:text-purple-800"
                    >
                      <BarChart2 size={16} />
                      {team.votesNational.toLocaleString()}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{team.regUsers}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center text-xs px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowRosterModal(true);
                        }}
                      >
                        <Users className="w-3.5 h-3.5 mr-1" /> Roster
                      </button>
                      <button className="text-gray-500 hover:text-blue-600">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-green-600">
                        <Edit size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-gray-800">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeams.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No teams found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden p-4 space-y-4">
          {filteredTeams.map((team) => {
            return (
              <div
                key={team.id}
                className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={team.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-500">{team.state}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Team ID:</strong> {team.id}
                  </p>
                  <p>
                    <strong>Votes (State):</strong>{" "}
                    {team.votesState.toLocaleString()}
                  </p>
                  <p>
                    <strong>Votes (National):</strong>{" "}
                    {team.votesNational.toLocaleString()}
                  </p>
                  <p>
                    <strong>Reg Users:</strong> {team.regUsers}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowRosterModal(true);
                      }}
                      className="flex items-center text-xs px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5 mr-1" /> Roster
                    </button>
                    <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">
                      <Eye size={14} className="inline mr-1" /> View
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                      <Edit size={14} className="inline mr-1" /> Edit
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Teams;
