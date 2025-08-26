import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Plus, ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { formatAPIDate } from "../utils/dateUtils";

const DEFAULT_WINNERS = [100];

export default function ContestCreate() {
  const [eventName, setEventName] = useState("");
  const [fee, setFee] = useState("");
  const [game, setGame] = useState("BGMI");
  const [map, setMap] = useState("Erangel");
  const [schedule, setSchedule] = useState("");
  const [roomSize, setRoomSize] = useState("");
  const [totalWinners, setTotalWinners] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [prizeDesc, setPrizeDesc] = useState("");
  const [privateDesc, setPrivateDesc] = useState("");
  const [team, setTeam] = useState("");
  const [errors, setErrors] = useState({});
  const [winners, setWinners] = useState(
    DEFAULT_WINNERS.map((p, i) => ({ id: Date.now() + i, percent: p, rank: (i + 1).toString() }))
  );
  
  // New states for banner images
  const [bannerImages, setBannerImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [filteredImages, setFilteredImages] = useState([]);
  
  // New states for selected image display
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const totalPercent = winners.reduce((s, w) => s + Number(w.percent || 0), 0);

  // Fetch banner images from API
  useEffect(() => {
    const fetchBannerImages = async () => {
      setIsLoadingImages(true);
      try {
        const response = await fetch("https://macstormbattle-backend.onrender.com/api/auth/admin/images", {
          method: "GET",
          headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJTdXBlckFkbWluIiwiaWF0IjoxNzU0OTgxNDk5LCJleHAiOjE3NTYyNzc0OTl9.xPlZ7KmQNNYAux0BzumgoQ1GI3ESdvgMDXMfRx6F53Q",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success" && result.data) {
          setBannerImages(result.data);
          setFilteredImages(result.data);
        }
      } catch (error) {
        console.error("Error fetching banner images:", error);
        toast.error("Failed to load banner images");
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchBannerImages();
  }, []);

  // Handle image selection from dropdown
  const handleImageSelect = (image) => {
    setSelectedImageTitle(image.title);
    setSelectedImageUrl(image.imageUrl);
    setBannerUrl(image.imageUrl); // This is what gets sent to backend
    setShowImageDropdown(false);
    setShowImagePreview(true);
  };

  // Filter images based on search input
  const filterImages = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredImages(bannerImages);
      return;
    }

    const filtered = bannerImages.filter(image =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.imageUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredImages(filtered);
  };

  // Handle banner title input changes (for searching)
  const handleBannerTitleChange = (value) => {
    setSelectedImageTitle(value);
    filterImages(value);
    
    // If user types something that doesn't match any title exactly, clear the URL
    const exactMatch = bannerImages.find(img => img.title === value);
    if (!exactMatch) {
      setBannerUrl("");
      setSelectedImageUrl("");
      setShowImagePreview(false);
    }
  };

  // Handle input focus
  const handleBannerInputFocus = () => {
    setShowImageDropdown(true);
    filterImages(selectedImageTitle);
  };

  // Clear selected image
  const clearSelectedImage = () => {
    setSelectedImageTitle("");
    setSelectedImageUrl("");
    setBannerUrl("");
    setShowImagePreview(false);
    setShowImageDropdown(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (!event.target.closest('.banner-dropdown-container')) {
      setShowImageDropdown(false);
    }
  };

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // helper to update a winner's percent or rank
  const updateWinner = (index, field, value) => {
    setWinners((prev) => {
      const copy = [...prev];
      if (field === 'percent') {
        const v = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
        copy[index] = { ...copy[index], percent: v };
      } else if (field === 'rank') {
        copy[index] = { ...copy[index], rank: value };
      }
      return copy;
    });
  };

  const addWinner = () => {
    setWinners((prev) => [...prev, { id: Date.now(), percent: 0, rank: "" }]);
  };

  const removeWinner = (index) => {
    setWinners((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!eventName.trim()) e.eventName = "Event name required";
    if (!fee || Number(fee) <= 0) e.fee = "Joining fee must be > 0";
    if (!schedule) e.schedule = "Match schedule required";
    if (!roomSize || Number(roomSize) < 8 || Number(roomSize) > 100)
      e.roomSize = "Room size must be between 8 and 100";
    if (winners.length === 0) e.winners = "At least one winner required";
    if (totalPercent !== 100) e.total = "Prize distribution total must be 100%";
    winners.forEach((w, i) => {
      if (w.percent === "" || isNaN(w.percent)) e[`w_${i}`] = "Enter a number";
      else if (w.percent < 0 || w.percent > 100)
        e[`w_${i}`] = "Value must be between 0 and 100";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Auto-generate winners array when totalWinners changes
  useEffect(() => {
    const count = Number(totalWinners);
    if (!count || count <= 0) return;
    setWinners((prev) => {
      const newArr = [];
      for (let i = 0; i < count; i++) {
        newArr.push({
          id: prev[i]?.id || Date.now() + i,
          percent: prev[i]?.percent || 0,
          rank: prev[i]?.rank || (i + 1).toString(),
        });
      }
      return newArr;
    });
  }, [totalWinners]);

  // Load for edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const fetchData = async () => {
      try {
        const [contestRes, prizeRes] = await Promise.all([
          fetch(`https://macstormbattle-backend.onrender.com/api/contest/${id}`),
          fetch(`https://macstormbattle-backend.onrender.com/api/prize/${id}`),
        ]);
        if (!contestRes.ok || !prizeRes.ok) throw new Error("Failed to load contest data");
        const contestData = await contestRes.json();
        const prizeData = await prizeRes.json();
        setEventName(contestData.event_name || "");
        setFee(contestData.joining_fee || "");
        setGame(contestData.game || "BGMI");
        setMap(contestData.map || "Erangel");
        setSchedule(contestData.match_schedule ? contestData.match_schedule.slice(0, 16) : "");
        setRoomSize(contestData.room_size || "");
        setTotalWinners(contestData.total_winners || "");
        setBannerUrl(contestData.banner_image_url || "");
        setDescription(contestData.match_description || "");
        setSponsor(contestData.match_sponsor || "");
        setPrizeDesc(contestData.prize_description || "");
        setPrivateDesc(contestData.match_private_description || "");
        setTeam(contestData.team || "");
        
        // Set banner image display if URL exists
        if (contestData.banner_image_url) {
          const matchingImage = bannerImages.find(img => img.imageUrl === contestData.banner_image_url);
          if (matchingImage) {
            setSelectedImageTitle(matchingImage.title);
            setSelectedImageUrl(matchingImage.imageUrl);
            setShowImagePreview(true);
          }
        }
        
        setWinners(
          (prizeData || []).map((p, i) => ({
            id: Date.now() + i,
            percent: p.percentage,
            rank: p.rank,
          }))
        );
      } catch (err) {
        toast.error(err.message || "Failed to load contest data");
        navigate("/solo");
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [isEditMode, id, bannerImages]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      event_name: eventName,
      room_size: Number(roomSize),
      joining_fee: Number(fee),
      total_winners: winners.length,
      distribution: winners.reduce((acc, w, idx) => {
        acc[w.rank && w.rank.trim() ? w.rank.trim() : (idx + 1).toString()] = Number(w.percent);
        return acc;
      }, {}),
      match_schedule: formatAPIDate(schedule),
      game,
      team: team || "SQUAD",
      map: map.toUpperCase(),
      banner_image_url: bannerUrl || null,
      prize_description: prizeDesc,
      match_sponsor: sponsor,
      match_description: description,
      match_private_description: privateDesc,
    };

    try {
      if (isEditMode) {
        await axiosInstance.patch(`/contest/${id}/edit`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Contest updated successfully!");
      } else {
        await axiosInstance.post("/contest/create", payload, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Contest created successfully!");
      }
      navigate("/solo");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save contest");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => window.history.back()}
            aria-label="Back to contests"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to contests
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? "Edit Contest" : "Create Contest"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name *
                </label>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.eventName ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="e.g., Squad Championship"
                />
                {errors.eventName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.eventName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Diamonds (💎) *
                </label>
                <input
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  type="number"
                  min={1}
                  step={1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                    errors.fee ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.fee && (
                  <p className="text-xs text-red-600 mt-1">{errors.fee}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game *
                </label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option>BGMI</option>
                  <option>PUBG</option>
                  <option>Free Fire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map *
                </label>
                <select
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option>Erangel</option>
                  <option>Sanhok</option>
                  <option>Miramar</option>
                  <option>Vikendi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Size *
              </label>
              <input
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
                type="number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.roomSize ? "border-red-400" : "border-gray-300"}
                `}
                placeholder="No. of players (Max 100)"
              />
              {errors.roomSize && (
                <p className="text-xs text-red-600 mt-1">{errors.roomSize}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Winners *
              </label>
              <input
                value={totalWinners}
                onChange={(e) => setTotalWinners(e.target.value)}
                type="number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.totalWinners ? "border-red-400" : "border-gray-300"}
                `}
                placeholder="Number of winners"
              />
              {errors.totalWinners && (
                <p className="text-xs text-red-600 mt-1">{errors.totalWinners}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Schedule *
              </label>
              <input
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                type="datetime-local"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                  errors.schedule ? "border-red-400" : "border-gray-300"}
                `}
              />
              {errors.schedule && (
                <p className="text-xs text-red-600 mt-1">{errors.schedule}</p>
              )}
            </div>

            {/* Prize Distribution */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Prize Distribution
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeWinner(winners.length - 1)}
                    disabled={winners.length <= 1}
                    title="Remove last winner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-sm text-gray-600">
                    {winners.length} winners
                  </span>

                  <button
                    type="button"
                    className="p-1 text-green-600 hover:text-green-800"
                    onClick={addWinner}
                    title="Add winner"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {winners.map((w, i) => (
                  <div key={w.id} className="flex items-center space-x-2 md:space-x-4">
                    <div className="w-20">
                      <input
                        value={w.rank}
                        onChange={e => updateWinner(i, 'rank', e.target.value)}
                        type="text"
                        className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300 text-center"
                        placeholder={i === 0 ? '1' : i === 1 ? '2' : i === 2 ? '3' : '4-10'}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        value={w.percent}
                        onChange={e => updateWinner(i, 'percent', e.target.value)}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                          errors[`w_${i}`]
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Percentage"
                      />
                      {errors[`w_${i}`] && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors[`w_${i}`]}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 w-8">%</span>
                    <button
                      type="button"
                      onClick={() => removeWinner(i)}
                      disabled={winners.length <= 1}
                      className="p-1 text-red-600 hover:text-red-800"
                      title={`Remove winner ${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div
                  className={`text-sm font-medium ${
                    totalPercent === 100 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Total: {totalPercent}%{" "}
                  {totalPercent !== 100 && "(must be 100%)"}
                </div>
                {errors.total && (
                  <div className="text-xs text-red-600">{errors.total}</div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Additional Information (Optional)
              </h3>

              {/* Enhanced Banner Image Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                <div className="space-y-3">
                  {/* Search/Selection Input */}
                  <div className="relative banner-dropdown-container">
                    <input
                      value={selectedImageTitle}
                      onChange={(e) => handleBannerTitleChange(e.target.value)}
                      onFocus={handleBannerInputFocus}
                      type="text"
                      className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Search and select banner image"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      {selectedImageTitle && (
                        <button
                          type="button"
                          onClick={clearSelectedImage}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setShowImageDropdown(!showImageDropdown);
                          if (!showImageDropdown) {
                            filterImages(selectedImageTitle);
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoadingImages}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${showImageDropdown ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  
                    {/* Dropdown for Banner Images */}
                    {showImageDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingImages ? (
                          <div className="px-4 py-2 text-gray-500">Loading images...</div>
                        ) : filteredImages.length > 0 ? (
                          filteredImages.map((image) => (
                            <button
                              key={image.id}
                              type="button"
                              onClick={() => handleImageSelect(image)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                            >
                              <img
                                src={image.imageUrl}
                                alt={image.title}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{image.title}</div>
                              </div>
                            </button>
                          ))
                        ) : selectedImageTitle.trim() ? (
                          <div className="px-4 py-2 text-gray-500">No images found matching "{selectedImageTitle}"</div>
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No images available</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image Preview */}
                  {showImagePreview && selectedImageUrl && (
                    <div className="mt-3">
                      <div className="relative inline-block">
                        <img
                          src={selectedImageUrl}
                          alt={selectedImageTitle || "Banner preview"}
                          className="h-32 w-auto rounded-lg border border-gray-300 object-cover"
                          onError={(e) => {
                            console.error("Failed to load image preview");
                            setShowImagePreview(false);
                          }}
                        />
                        <button
                          type="button"
                          onClick={clearSelectedImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {selectedImageTitle && (
                        <p className="text-sm text-gray-600 mt-2">Selected: {selectedImageTitle}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Describe your contest..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor
                  </label>
                  <input
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Sponsor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prize Description
                  </label>
                  <input
                    value={prizeDesc}
                    onChange={(e) => setPrizeDesc(e.target.value)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Top 5 teams win"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private Description
                </label>
                <textarea
                  value={privateDesc}
                  onChange={(e) => setPrivateDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={2}
                  placeholder="Private info for admins or players"
                />
              </div>

            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={totalPercent !== 100}
              >
                {isEditMode ? "Update Contest" : "Create Contest"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}