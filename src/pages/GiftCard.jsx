"use client"

import { useState, useEffect } from "react"
import { X, Copy, Gift, Diamond, CheckCircle, Edit, Trash2, Plus, Upload } from "lucide-react"
import axiosInstance from "../utils/axios"

const GiftCardStore = () => {
  const [currentView, setCurrentView] = useState("main") // 'main', 'history', 'create', or 'edit'
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Cards")
  const [giftCards, setGiftCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCard, setEditingCard] = useState(null)
  
  // Form states for create/edit
  const [formData, setFormData] = useState({
    value: '',
    diamonds: '',
    image: null
  })

  const redemptionHistory = [
    {
      id: 1,
      name: "Amazon Gift Card",
      value: 25,
      cost: 2500,
      status: "Completed",
      date: "20/12/2024 at 4:00:00 pm",
      code: "AMZ-XXXX-XXXX-1234",
    },
    {
      id: 2,
      name: "Netflix Gift Card",
      value: 15,
      cost: 1500,
      status: "Completed",
      date: "18/12/2024 at 7:45:00 pm",
      code: "NFX-XXXX-XXXX-5678",
    },
    {
      id: 3,
      name: "Steam Gift Card",
      value: 50,
      cost: 5000,
      status: "Processing",
      date: "15/12/2024 at 3:15:00 pm",
      code: null,
    },
  ]

  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU0OTgxNDk5LCJleHAiOjE3NTYyNzc0OTl9.xPlZ7KmQNNYAux0BzumgoQ1GI3ESdvgMDXMfRx6F53Q"

  // Fetch gift cards from API
  const fetchGiftCards = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://macstormbattle-backend-2.onrender.com/api/giftcards', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      
      if (result.success) {
        setGiftCards(result.data)
      } else {
        showToastMessage("Failed to fetch gift cards", "error")
      }
    } catch (error) {
      console.error('Error fetching gift cards:', error)
      showToastMessage("Error fetching gift cards", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGiftCards()
  }, [])

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleCreateCard = async (e) => {
    if (e) e.preventDefault()
    
    if (!formData.value || !formData.diamonds || !formData.image) {
      showToastMessage("Please fill all fields and select an image", "error")
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', formData.image)
      formDataToSend.append('value', formData.value)
      formDataToSend.append('diamonds', formData.diamonds)

      const response = await fetch('https://macstormbattle-backend-2.onrender.com/api/giftcards/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        showToastMessage("Gift card created successfully!")
        setFormData({ value: '', diamonds: '', image: null })
        setCurrentView("main")
        fetchGiftCards() // Refresh the list
      } else {
        showToastMessage("Failed to create gift card", "error")
      }
    } catch (error) {
      console.error('Error creating gift card:', error)
      showToastMessage("Error creating gift card", "error")
    }
  }

  const handleUpdateCard = async (e) => {
    if (e) e.preventDefault()
    
    if (!formData.value || !formData.diamonds) {
      showToastMessage("Please fill all required fields", "error")
      return
    }

    try {
      const formDataToSend = new FormData()
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }
      formDataToSend.append('value', formData.value)
      formDataToSend.append('diamonds', formData.diamonds)

      const response = await fetch(`https://macstormbattle-backend-2.onrender.com/api/giftcards/${editingCard.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        showToastMessage("Gift card updated successfully!")
        setFormData({ value: '', diamonds: '', image: null })
        setEditingCard(null)
        setCurrentView("main")
        fetchGiftCards() // Refresh the list
      } else {
        showToastMessage("Failed to update gift card", "error")
      }
    } catch (error) {
      console.error('Error updating gift card:', error)
      showToastMessage("Error updating gift card", "error")
    }
  }

  const handleDeleteCard = async (card) => {
    if (!window.confirm(`Are you sure you want to delete this gift card worth ${card.value}?`)) {
      return
    }

    try {
      const response = await fetch(`https://macstormbattle-backend-2.onrender.com/api/giftcards/${card.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        showToastMessage("Gift card deleted successfully!")
        fetchGiftCards() // Refresh the list
      } else {
        showToastMessage("Failed to delete gift card", "error")
      }
    } catch (error) {
      console.error('Error deleting gift card:', error)
      showToastMessage("Error deleting gift card", "error")
    }
  }

  const handleEditClick = (card) => {
    setEditingCard(card)
    setFormData({
      value: card.value.toString(),
      diamonds: card.diamonds.toString(),
      image: null
    })
    setCurrentView("edit")
  }

  const handleRedeemClick = (card) => {
    setSelectedCard(card)
    setShowRedeemModal(true)
    setConfirmChecked(false)
  }

  const handleConfirmRedemption = () => {
    if (confirmChecked) {
      setShowRedeemModal(false)
      setSelectedCard(null)
      setConfirmChecked(false)
      showToastMessage("Gift card redeemed successfully!")
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  const resetForm = () => {
    setFormData({ value: '', diamonds: '', image: null })
    setEditingCard(null)
  }

  // Create/Edit Form Component
  const renderForm = () => {
    const isEditing = currentView === "edit"
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                resetForm()
                setCurrentView("main")
              }}
              className="p-2 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Gift Card' : 'Create Gift Card'}
              </h1>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Update gift card details' : 'Add a new gift card to the store'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6">
            <div onSubmit={isEditing ? handleUpdateCard : handleCreateCard}>
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gift Card Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      {formData.image ? formData.image.name : 'Click to upload or drag and drop'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </label>
                    {!isEditing && (
                      <p className="text-xs text-gray-500 mt-1">* Required</p>
                    )}
                  </div>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gift Card Value (💎)
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter gift card value"
                    required
                  />
                </div>

                {/* Diamonds */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diamond Cost
                  </label>
                  <input
                    type="number"
                    value={formData.diamonds}
                    onChange={(e) => setFormData({ ...formData, diamonds: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter diamond cost"
                    required
                  />
                </div>

                {/* Current Image Preview (for editing) */}
                {isEditing && editingCard?.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <img
                      src={editingCard.imageUrl}
                      alt="Current gift card"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      setCurrentView("main")
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={isEditing ? handleUpdateCard : handleCreateCard}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? 'Update Gift Card' : 'Create Gift Card'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "create" || currentView === "edit") {
    return renderForm()
  }

  if (currentView === "history") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Gift Card Store</h1>
              <p className="text-sm text-gray-600">Redeem diamonds for amazing rewards</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-purple-600">
              <span className="text-sm font-medium">Rewards Available</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <button
                onClick={() => setCurrentView("main")}
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-1">Browse Gift Cards</h4>
                <p className="text-sm text-gray-600">Discover and redeem amazing rewards</p>
              </button>
              <button className="p-4 bg-blue-600 text-white rounded-xl text-left">
                <h4 className="font-medium mb-1">Redemption History</h4>
                <p className="text-sm opacity-90">View your past redemptions</p>
              </button>
            </div>
          </div>

          {/* Redemption History */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Redemption History</h2>
            <div className="space-y-6">
              {redemptionHistory.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Value:</span>
                          <span className="font-semibold text-green-600">${item.value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cost:</span>
                          <span className="text-gray-900">{item.cost.toLocaleString()} diamonds</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-sm text-gray-600 mb-2">Redeemed on {item.date}</p>
                      {item.code && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Gift Card Code:</p>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm">{item.code}</code>
                            <button
                              onClick={() => copyToClipboard(item.code)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {showToast && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
            toastMessage.includes("Error") || toastMessage.includes("Failed") 
              ? "bg-red-500 text-white" 
              : "bg-green-500 text-white"
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Gift Card Store</h1>
              <p className="text-sm text-gray-600">Redeem diamonds for amazing rewards</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView("create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Gift Card
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <button className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition-colors">
              <h4 className="font-medium text-gray-900 mb-1">Browse Gift Cards</h4>
              <p className="text-sm text-gray-600">Discover and redeem amazing rewards</p>
            </button>
            <button
              onClick={() => setCurrentView("history")}
              className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">Redemption History</h4>
              <p className="text-sm text-gray-600">View your past redemptions</p>
            </button>
          </div>
        </div>

        {/* Gift Cards Section */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Gift Card Store</h2>
                <p className="text-sm text-gray-600">Available gift cards ({giftCards.length})</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading gift cards...</p>
            </div>
          ) : (
            <>
              {/* Gift Cards Grid */}
              {giftCards.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No gift cards available</p>
                  <button
                    onClick={() => setCurrentView("create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add First Gift Card
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {giftCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={card.imageUrl || "/placeholder.svg"} 
                        alt={`$${card.value} Gift Card`} 
                        className="w-full h-32 object-cover" 
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">💎{card.value} Gift Card</h3>
                            <p className="text-xs text-gray-600">Digital Gift Card</p>
                          </div>
                          <span className="text-lg font-bold text-green-600">💎{card.value}</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Diamond className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm font-semibold">{card.diamonds.toLocaleString()}</span>
                          </div>
                          <span className="text-xs text-gray-500">In Stock</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(card)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Redeem Gift Card</h3>
                </div>
                <button onClick={() => setShowRedeemModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <img
                src={selectedCard.imageUrl || "/placeholder.svg"}
                alt={`$${selectedCard.value} Gift Card`}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">${selectedCard.value} Gift Card</h4>
                  <p className="text-sm text-gray-600">Digital Gift Card</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-green-600">${selectedCard.value}</span>
                <div className="flex items-center gap-1">
                  <Diamond className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{selectedCard.diamonds.toLocaleString()}</span>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Transaction Summary</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Current Diamonds:</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-500" />
                      <span className="font-semibold">25,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600">Cost:</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-500" />
                      <span className="font-semibold">-{selectedCard.diamonds.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span className="text-sm font-medium text-blue-600">Remaining:</span>
                    <div className="flex items-center gap-1">
                      <Diamond className="w-3 h-3 text-yellow-500" />
                      <span className="font-semibold">{(25000 - selectedCard.diamonds).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I want to redeem this gift card for {selectedCard.diamonds.toLocaleString()}{" "}
                    diamonds. This action cannot be undone.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRedemption}
                  disabled={!confirmChecked}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    confirmChecked
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  Confirm Redemption
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftCardStore