"use client"

import { useState, useEffect } from "react"

const WithdrawalTable = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://macstormbattle-backend.onrender.com/api/user/withdraw', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU4Nzg0NzM5LCJleHAiOjE3NjAwODA3Mzl9.XYvdilXiq85bii3hm4pMCMlSa0Gw1u4gwb70-Vt9Jto',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status && data.data) {
        setWithdrawals(data.data)
      } else {
        console.error("Failed to fetch withdrawals:", data.message || "Unknown error")
        setWithdrawals([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setWithdrawals([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = (withdrawalId, newStatus) => {
    // Just for display - no actual API call
    console.log(`Action clicked: ${newStatus} for withdrawal ID: ${withdrawalId}`)
    // You can add your PUT API logic here later
  }

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = withdrawals.slice(indexOfFirstItem, indexOfLastItem)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Calculate total pages
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    )
  }

  const ActionButtons = ({ withdrawal, serialNo }) => {
    if (withdrawal.status === 'approved' || withdrawal.status === 'rejected') {
      return (
        <span className="text-xs text-gray-500 italic">
          {withdrawal.status === 'approved' ? 'Already Approved' : 'Already Rejected'}
        </span>
      )
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleStatusUpdate(withdrawal.id, 'approved')}
          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={() => handleStatusUpdate(withdrawal.id, 'rejected')}
          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Withdrawal Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Total: {withdrawals.length} requests</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((withdrawal, index) => {
                const serialNo = indexOfFirstItem + index + 1
                return (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {serialNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{withdrawal.User?.user_name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{withdrawal.User?.email_id || "No email"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{withdrawal.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.payment_method?.toUpperCase() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(withdrawal.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(withdrawal.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{withdrawal.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ActionButtons withdrawal={withdrawal} serialNo={serialNo} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Tablet View */}
        <div className="hidden md:block lg:hidden">
          <div className="divide-y divide-gray-200">
            {currentItems.map((withdrawal, index) => {
              const serialNo = indexOfFirstItem + index + 1
              return (
                <div key={withdrawal.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">#{serialNo}</span>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">₹{withdrawal.amount}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">User:</span>
                      <div className="font-medium text-gray-900">{withdrawal.User?.user_name || "N/A"}</div>
                      <div className="text-gray-500">{withdrawal.User?.email_id || "No email"}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment:</span>
                      <div className="text-gray-900">{withdrawal.payment_method?.toUpperCase() || "N/A"}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">{formatDate(withdrawal.createdAt)}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{withdrawal.description}</div>
                  <div className="mt-3">
                    <ActionButtons withdrawal={withdrawal} serialNo={serialNo} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {currentItems.map((withdrawal, index) => {
              const serialNo = indexOfFirstItem + index + 1
              return (
                <div key={withdrawal.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">#{serialNo}</span>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">₹{withdrawal.amount}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">User:</span>
                      <div className="font-medium text-gray-900">{withdrawal.User?.user_name || "N/A"}</div>
                    </div>

                    <div>
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="ml-2 text-gray-900">{withdrawal.payment_method?.toUpperCase() || "N/A"}</span>
                    </div>

                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 text-gray-900">{formatDate(withdrawal.createdAt)}</span>
                    </div>

                    <div className="text-gray-600">{withdrawal.description}</div>
                    
                    <div className="pt-2">
                      <ActionButtons withdrawal={withdrawal} serialNo={serialNo} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastItem, withdrawals.length)}</span> of{" "}
                <span className="font-medium">{withdrawals.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawalTable