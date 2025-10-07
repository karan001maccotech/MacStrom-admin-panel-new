"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Trash2,
  Plus,
  Download,
  Search,
  X,
  Eye,
  TrendingUp,
  Users,
  Trophy,
  Gamepad2,
  MoreVertical,
  Pencil,
} from "lucide-react"
import axiosInstance from "../utils/axios"

const API_URL = "https://macstormbattle-backend-2.onrender.com/api/tournament"

export default function EnhancedGamingTable() {
  // Removed hardcoded initialGamingData; data now comes from GET API
  const [gamingData, setGamingData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    gameName: "",
    teamName: "",
    username: "",
    level: "",
    registrationAmount: "",
    paymentId: "",
    registrationDate: "",
    status: "pending",
    age: "",
  })
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })
  const [openMenuId, setOpenMenuId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchData() {
      try {
        setIsLoading(true)
        const res = await axiosInstance.get(API_URL, { signal: controller.signal })
        const data = res.data

        const mapped = (Array.isArray(data) ? data : []).map((item) => {
          const fd = item.formData || {}
          return {
            id: item.id,
            gameName: fd.game || "N/A",
            teamName: fd.teamName || "N/A",
            username: fd.inGameUsername || fd.username || "N/A",
            level: Number(fd.inGameLevel) || 0,
            registrationAmount: Number(fd.registrationAmount) || 0,
            paymentId: fd.paymentId || item.paymentId || "",
            registrationDate: item.createdAt || null,
            status: item.status || fd.status || "pending",
            age: fd.age || "",
          }
        })

        if (isMounted) {
          setGamingData(mapped)
        }
      } catch (err) {
        if (isMounted) {
          showNotification("Failed to load data from API", "error")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const onDocClick = () => setOpenMenuId(null)
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  const filteredData = useMemo(() => {
    return gamingData.filter(
      (item) =>
        (item.gameName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.teamName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.level || "").includes(searchTerm),
    )
  }, [gamingData, searchTerm])

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, page, rowsPerPage])

  const statsData = useMemo(() => {
    const totalPlayers = gamingData.length
    const avgLevel =
      totalPlayers > 0
        ? Math.round(gamingData.reduce((sum, player) => sum + (Number(player.level) || 0), 0) / totalPlayers)
        : 0
    const topLevel = totalPlayers > 0 ? Math.max(...gamingData.map((player) => Number(player.level) || 0)) : 0

    // ✅ define valid games (only these count)
    const validGames = ["free fire", "bgmi", "pubg"]

    // normalize + filter
    const uniqueGamesSet = new Set(
      gamingData.map((p) => (p.gameName || "").trim().toLowerCase()).filter((name) => validGames.includes(name)),
    )

    const uniqueGamesCount = uniqueGamesSet.size

    return { totalPlayers, avgLevel, topLevel, uniqueGamesCount }
  }, [gamingData])

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "success" }), 4000)
  }

  const exportToCSV = () => {
    const headers = [
      "Game Name",
      "Team Name",
      "InGame Username",
      "InGame Level",
      "Amount",
      "Payment ID",
      "Registration Date & Time",
      "Status",
      "Age",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredData.map(
        (row) =>
          `"${row.gameName}","${row.teamName}","${row.username}",${row.level},${row.registrationAmount},"${row.paymentId || ""}","${
            row.registrationDate || ""
          }","${row.status || ""}","${row.age || ""}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "gaming_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification("Data exported successfully!")
  }

  const handleEdit = (id) => {
    const item = gamingData.find((item) => item.id === id)
    setEditingId(id)
    setEditValues(item || {})
  }

  const handleSave = async (id) => {
    if (
      !editValues.gameName ||
      !editValues.teamName ||
      !editValues.username ||
      editValues.level === "" ||
      editValues.level === null
    ) {
      showNotification("All fields are required!", "error")
      return
    }

    if (isNaN(editValues.level) || editValues.level < 1 || editValues.level > 100) {
      showNotification("Level must be a number between 1 and 100!", "error")
      return
    }

    try {
      setIsLoading(true)
      
      // Prepare the data payload for the API
      const updatePayload = {
        formData: {
          game: editValues.gameName,
          teamName: editValues.teamName,
          inGameUsername: editValues.username,
          inGameLevel: Number(editValues.level),
          registrationAmount: Number(editValues.registrationAmount) || 0,
          paymentId: editValues.paymentId || "",
          age: editValues.age || "",
        },
        status: editValues.status || "pending",
      }

      // Call the PUT API
      await axiosInstance.put(`${API_URL}/${id}`, updatePayload)

      // Update local state
      setGamingData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...editValues,
                level: Number(editValues.level),
                registrationAmount: Number(editValues.registrationAmount) || 0,
                registrationDate: editValues.registrationDate || item.registrationDate || null,
                paymentId: editValues.paymentId || "",
                status: editValues.status || item.status || "pending",
                age: editValues.age || item.age || "",
              }
            : item,
        ),
      )

      setEditingId(null)
      setEditValues({})
      showNotification("Entry updated successfully!")
    } catch (error) {
      console.error("Error updating entry:", error)
      showNotification("Failed to update entry. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleDelete = (id) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setIsLoading(true)
      
      // Call the DELETE API
      await axiosInstance.delete(`${API_URL}/${deleteId}`)
      
      // Update local state
      setGamingData((prev) => prev.filter((item) => item.id !== deleteId))
      
      setDeleteDialogOpen(false)
      setDeleteId(null)
      showNotification("Entry deleted successfully!", "warning")
    } catch (error) {
      console.error("Error deleting entry:", error)
      showNotification("Failed to delete entry. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    if (
      !newEntry.gameName ||
      !newEntry.teamName ||
      !newEntry.username ||
      newEntry.level === "" ||
      newEntry.level === null
    ) {
      showNotification("All fields are required!", "error")
      return
    }

    if (isNaN(newEntry.level) || newEntry.level < 1 || newEntry.level > 100) {
      showNotification("Level must be a number between 1 and 100!", "error")
      return
    }

    const newId = (gamingData.length ? Math.max(...gamingData.map((item) => item.id)) : 0) + 1
    const newPlayer = {
      id: newId,
      gameName: newEntry.gameName,
      teamName: newEntry.teamName,
      username: newEntry.username,
      level: Number(newEntry.level),
      registrationAmount: Number(newEntry.registrationAmount) || 0,
      paymentId: newEntry.paymentId || "",
      registrationDate: newEntry.registrationDate || null, // stays client-side for created entries
      status: newEntry.status || "pending",
      age: newEntry.age || "",
    }

    setGamingData((prev) => [...prev, newPlayer])
    setCreateDialogOpen(false)
    setNewEntry({
      gameName: "",
      teamName: "",
      username: "",
      level: "",
      registrationAmount: "",
      paymentId: "",
      registrationDate: "",
      status: "pending",
      age: "",
    })
    showNotification("New entry created successfully!")
  }

  

  const getLevelBadge = (level) => {
    if (level >= 95) return { color: "bg-red-100 text-red-800 border-red-200", label: "Elite" }
    if (level >= 90) return { color: "bg-green-100 text-green-800 border-green-200", label: "Pro" }
    if (level >= 85) return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Advanced" }
    return { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Intermediate" }
  }

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Gaming Data Management
          </h1>
          <p className="text-gray-600 mb-6">Comprehensive gaming team data with advanced management capabilities</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-600 from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.totalPlayers}</p>
                  <p className="text-blue-100 text-sm">Total Players</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.avgLevel}</p>
                  <p className="text-green-100 text-sm">Avg Level</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.topLevel}</p>
                  <p className="text-purple-100 text-sm">Top Level</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-gray-600 from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{statsData.uniqueGamesCount}</p>
                  <p className="text-orange-100 text-sm">Unique Games</p>
                </div>
                <Gamepad2 className="h-8 w-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by game, team, username, or level..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(0)
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setPage(0)
              }}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              onClick={exportToCSV}
              disabled={isLoading}
              className="px-6 py-3 bg-black from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
            <button
              onClick={() => setCreateDialogOpen(true)}
              disabled={isLoading}
              className="px-6 py-3 bg-black from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              Create New
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Eye className="h-4 w-4" />
            Showing {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            {searchTerm && ` (filtered from ${gamingData.length} total)`}
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Game</th>
                  <th className="px-6 py-4 text-left font-semibold">Team</th>
                  <th className="px-6 py-4 text-left font-semibold">Username</th>
                  <th className="px-6 py-4 text-center font-semibold">Level</th>
                  <th className="px-6 py-4 text-center font-semibold">Amount</th>
                  <th className="px-6 py-4 text-center font-semibold">Payment ID</th>
                  <th className="px-6 py-4 text-center font-semibold">Reg. Date & Time</th>
                  <th className="px-6 py-4 text-center font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Age</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => {
                  const isEditing = editingId === row.id
                  const isMenuOpen = openMenuId === row.id
                  return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      {/* Game */}
                      <td className="px-6 py-4 text-left">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.gameName || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, gameName: e.target.value }))}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">{row.gameName}</span>
                        )}
                      </td>

                      {/* Team */}
                      <td className="px-6 py-4 text-left">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.teamName || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, teamName: e.target.value }))}
                            className="w-40 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-700">{row.teamName}</span>
                        )}
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4 text-left">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.username || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, username: e.target.value }))}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-700">{row.username}</span>
                        )}
                      </td>

                      {/* Level */}
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.level ?? ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, level: e.target.value }))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelBadge(Number(row.level)).color}`}
                          >
                            {row.level}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.registrationAmount ?? ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, registrationAmount: e.target.value }))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        ) : (
                          <span className="font-medium text-gray-900">₹{row.registrationAmount || 0}</span>
                        )}
                      </td>

                      {/* Payment ID */}
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValues.paymentId || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, paymentId: e.target.value }))}
                            className="w-36 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        ) : row.paymentId ? (
                          <span className="font-mono text-purple-600">{row.paymentId}</span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      {/* Registration Date (from API only) */}
                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="datetime-local"
                            value={editValues.registrationDate || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, registrationDate: e.target.value }))}
                            className="w-56 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        ) : row.registrationDate ? (
                          <span className="text-gray-700">{new Date(row.registrationDate).toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <select
                            value={editValues.status || "pending"}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, status: e.target.value }))}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          >
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              row.status === "approved"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : row.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }`}
                          >
                            {row.status || "pending"}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.age ?? ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, age: e.target.value }))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                          />
                        ) : row.age ? (
                          <span className="text-gray-700">{row.age}</span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(row.id)}
                              disabled={isLoading}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={isLoading}
                              className="ml-2 px-3 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              aria-haspopup="true"
                              aria-expanded={openMenuId === row.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === row.id ? null : row.id)
                              }}
                              disabled={isLoading}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Actions"
                            >
                              <MoreVertical className="h-5 w-5" />
                              <span className="sr-only">Open actions</span>
                            </button>

                            {openMenuId === row.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
                                role="menu"
                              >
                                <ul className="py-1">
                                  <li>
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null)
                                        handleEdit(row.id)
                                      }}
                                      disabled={isLoading}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                      role="menuitem"
                                    >
                                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
                                        <Pencil className="h-3.5 w-3.5" />
                                      </span>
                                      <span className="text-gray-700">Edit</span>
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null)
                                        handleDelete(row.id)
                                      }}
                                      disabled={isLoading}
                                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                      role="menuitem"
                                    >
                                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </span>
                                      <span className="text-red-700">Delete</span>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0 || isLoading}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1 || isLoading}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* No Results */}
        {filteredData.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl mt-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or create a new entry</p>
            <button
              onClick={() => setCreateDialogOpen(true)}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              Create New Entry
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Entry Modal */}
      {createDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Create New Player Entry</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
                  <input
                    type="text"
                    value={newEntry.gameName}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, gameName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={newEntry.teamName}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={newEntry.username}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newEntry.level}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={newEntry.registrationAmount}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, registrationAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment ID</label>
                  <input
                    type="text"
                    value={newEntry.paymentId}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, paymentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newEntry.registrationDate}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, registrationDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newEntry.status}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading}
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={newEntry.age}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Create Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                  ? "bg-red-500"
                  : "bg-orange-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" && <TrendingUp className="h-5 w-5" />}
                {notification.type === "error" && <X className="h-5 w-5" />}
                {notification.type === "warning" && <Trash2 className="h-5 w-5" />}
              </div>
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}