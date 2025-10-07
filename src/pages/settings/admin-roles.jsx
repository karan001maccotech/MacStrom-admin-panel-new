"use client"

import { useState, useEffect, useCallback, memo } from "react"
import axios from "axios"
import axiosInstance from "../../utils/axios"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Users, Plus, Edit, UserX, Trash2, X } from "lucide-react"

const AdminRoles = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  // State management
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Admin", // Auto-select Admin by default
    permissions: {
      manageUsers: true,
      manageFinance: true,
      viewReports: true,
      manageTournaments: false,
      manageSettings: false,
      deleteBids: false,
    },
  })
  const [admins, setAdmins] = useState([])

  // Permission mapping for API
  const permissionMapping = {
    manageUsers: "manage_users",
    manageFinance: "manage_finance", 
    viewReports: "view_reports",
    manageTournaments: "manage_tournaments",
    manageSettings: "manage_settings",
    deleteBids: "delete_bids"
  }

  // Reverse mapping for loading data from API
  const reversePermissionMapping = {
    manage_users: "manageUsers",
    manage_finance: "manageFinance",
    view_reports: "viewReports", 
    manage_tournaments: "manageTournaments",
    manage_settings: "manageSettings",
    delete_bids: "deleteBids"
  }

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(`/auth/admin/getadmins`)
      
      // Transform API data to match component structure
      const transformedAdmins = response.data.map(admin => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: "active", // Default since API doesn't provide status
        permissions: admin.permissions.length,
        lastLogin: admin.sessions.length > 0 
          ? new Date(admin.sessions[admin.sessions.length - 1].expiresAt).toLocaleString()
          : "Never",
        avatar: null, // Remove problematic avatar URL
        phone: admin.phone,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        permissionsData: admin.permissions,
        sessions: admin.sessions
      }))
      
      setAdmins(transformedAdmins)
      setSuccess("Admins loaded successfully")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error fetching admins:', err)
      setError(err.response?.data?.message || 'Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins()
  }, [])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Memoized handlers to prevent input focus loss
  const handleFullNameChange = useCallback((e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, fullName: value }))
  }, [])

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, email: value }))
  }, [])

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, password: value }))
  }, [])

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, phone: value }))
  }, [])

  const handleRoleChange = useCallback((e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, role: value }))
  }, [])

  const handlePermissionChange = useCallback((permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "Admin",
      permissions: {
        manageUsers: true,
        manageFinance: true,
        viewReports: true,
        manageTournaments: false,
        manageSettings: false,
        deleteBids: false,
      },
    })
  }, [])

  const handleCreateAdmin = async () => {
    try {
      setSubmitting(true)
      setError(null)

      // Transform permissions to API format
      const apiPermissions = Object.entries(formData.permissions).map(([key, value]) => ({
        permission: permissionMapping[key],
        granted: value
      }))

      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        permissions: apiPermissions
      }

      await axiosInstance.post('/auth/admin/createadmin', payload)
      
      setSuccess("Admin created successfully!")
      setShowCreateModal(false)
      resetForm()
      fetchAdmins() // Refresh the list
    } catch (err) {
      console.error('Error creating admin:', err)
      setError(err.response?.data?.message || 'Failed to create admin')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAdmin = useCallback((admin) => {
    setEditingAdmin(admin)
    
    // Convert API permissions back to form format
    const permissionsObj = {
      manageUsers: false,
      manageFinance: false,
      viewReports: false,
      manageTournaments: false,
      manageSettings: false,
      deleteBids: false,
    }
    
    admin.permissionsData.forEach(perm => {
      const formKey = reversePermissionMapping[perm.permission]
      if (formKey) {
        permissionsObj[formKey] = perm.granted
      }
    })

    setFormData({
      fullName: admin.name,
      email: admin.email,
      password: "", // Don't pre-fill password for security
      phone: admin.phone || "",
      role: admin.role,
      permissions: permissionsObj
    })
    
    setShowEditModal(true)
  }, [reversePermissionMapping])

  const handleUpdateAdmin = async () => {
    try {
      setSubmitting(true)
      setError(null)

      // Transform permissions to API format
      const apiPermissions = Object.entries(formData.permissions).map(([key, value]) => ({
        permission: permissionMapping[key],
        granted: value
      }))

      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        permissions: apiPermissions
      }

      // Only include password if it's provided
      if (formData.password.trim()) {
        payload.password = formData.password
      }

      await axiosInstance.put(`/auth/admin/updateadmin/${editingAdmin.id}`, payload)
      
      setSuccess("Admin updated successfully!")
      setShowEditModal(false)
      setEditingAdmin(null)
      resetForm()
      fetchAdmins() // Refresh the list
    } catch (err) {
      console.error('Error updating admin:', err)
      setError(err.response?.data?.message || 'Failed to update admin')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      return
    }

    try {
      setError(null)
      await axiosInstance.delete(`/auth/admin/deleteadmin/${id}`)
      
      setSuccess("Admin deleted successfully!")
      fetchAdmins() // Refresh the list
    } catch (err) {
      console.error('Error deleting admin:', err)
      setError(err.response?.data?.message || 'Failed to delete admin')
    }
  }

  const handleRefresh = () => {
    fetchAdmins()
  }

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
    resetForm()
    setError(null)
    setSubmitting(false)
  }, [resetForm])

  const closeEditModal = useCallback(() => {
    setShowEditModal(false)
    setEditingAdmin(null)
    resetForm()
    setError(null)
    setSubmitting(false)
  }, [resetForm])

  const AdminCard = memo(({ admin }) => (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: "1px solid #e5e7eb",
        borderRadius: 2,
        backgroundColor: "#ffffff",
        "&:hover": {
          borderColor: "#3b82f6",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#3b82f6",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {admin.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "#111827",
                }}
              >
                {admin.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={admin.role}
                  size="small"
                  sx={{
                    backgroundColor: admin.role === "Super Admin" ? "#dbeafe" : "#f3f4f6",
                    color: admin.role === "Super Admin" ? "#1d4ed8" : "#6b7280",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
                <Chip
                  label={admin.status}
                  size="small"
                  sx={{
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              </Stack>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                mb: 0.5,
                fontSize: "0.875rem",
              }}
            >
              {admin.email}
            </Typography>
            {admin.phone && (
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  mb: 0.5,
                  fontSize: "0.875rem",
                }}
              >
                Phone: {admin.phone}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              Last session: {admin.lastLogin}
            </Typography>
          </Box>
          <Stack direction={{ xs: "row", sm: "column" }} spacing={1} alignItems={{ xs: "center", sm: "flex-end" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "0.875rem",
                mb: { xs: 0, sm: 1 },
              }}
            >
              {admin.permissions} permissions
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                sx={{
                  color: "#3b82f6",
                  "&:hover": { backgroundColor: "#eff6ff" },
                }}
                onClick={() => handleEditAdmin(admin)}
              >
                <Edit size={16} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#f59e0b",
                  "&:hover": { backgroundColor: "#fffbeb" },
                }}
              >
                <UserX size={16} />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "#fef2f2" },
                }}
                onClick={() => handleDeleteAdmin(admin.id)}
              >
                <Trash2 size={16} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ))

  const renderForm = (isEdit = false) => (
    <>
      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        {isEdit ? "Update admin user information and permissions" : "Add a new admin user with specific permissions"}
      </Typography>
      <Stack spacing={3}>
        {/* Name and Email */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={handleFullNameChange}
            size="medium"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3b82f6",
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleEmailChange}
            size="medium"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3b82f6",
              },
            }}
          />
        </Stack>

        {/* Phone and Password */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={handlePhoneChange}
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3b82f6",
              },
            }}
          />
          <TextField
            fullWidth
            label={isEdit ? "New Password (optional)" : "Password"}
            type="password"
            value={formData.password}
            onChange={handlePasswordChange}
            size="medium"
            required={!isEdit}
            helperText={isEdit ? "Leave blank to keep current password" : ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#3b82f6",
              },
            }}
          />
        </Stack>

        {/* Role */}
        <FormControl fullWidth size="medium">
          <InputLabel
            sx={{
              "&.Mui-focused": {
                color: "#3b82f6",
              },
            }}
          >
            Role
          </InputLabel>
          <Select
            value={formData.role}
            label="Role"
            onChange={handleRoleChange}
            sx={{
              borderRadius: 1.5,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
              },
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Moderator">Moderator</MenuItem>
          </Select>
        </FormControl>

        {/* Permissions */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#111827",
              fontSize: "1rem",
            }}
          >
            Permissions
          </Typography>
          <Stack spacing={1}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.manageUsers}
                    onChange={(e) => handlePermissionChange("manageUsers", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>Manage Users</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.manageTournaments}
                    onChange={(e) => handlePermissionChange("manageTournaments", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>Manage Tournaments</Typography>
                }
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.manageFinance}
                    onChange={(e) => handlePermissionChange("manageFinance", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>Manage Finance</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.manageSettings}
                    onChange={(e) => handlePermissionChange("manageSettings", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>Manage Settings</Typography>}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.viewReports}
                    onChange={(e) => handlePermissionChange("viewReports", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>View Reports</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.deleteBids}
                    onChange={(e) => handlePermissionChange("deleteBids", e.target.checked)}
                    sx={{
                      color: "#d1d5db",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: "0.875rem", color: "#374151" }}>Delete Bids</Typography>}
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "95%",
          mx: "auto",
        }}
      >
        {/* Header Card */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#dbeafe",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={24} color="#3b82f6" />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: "1.875rem",
                    mb: 0.5,
                  }}
                >
                  Admin Roles
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6b7280",
                    fontSize: "1rem",
                  }}
                >
                  Manage admin users and permissions
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Main Content Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent>
            {/* Section Header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                  fontSize: "1.25rem",
                }}
              >
                Admin Users ({admins.length})
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderColor: "#d1d5db",
                    color: "#374151",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      color: "#3b82f6",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={16} /> : "Refresh"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  onClick={() => setShowCreateModal(true)}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    backgroundColor: "#1A1A1A",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#1A1A1A",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  Create Admin
                </Button>
              </Stack>
            </Stack>

            {/* Admin List */}
            <Box>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : admins.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    color: "#6b7280",
                  }}
                >
                  <Users size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No admin users found
                  </Typography>
                  <Typography variant="body2">
                    Get started by creating your first admin user
                  </Typography>
                </Box>
              ) : (
                admins.map((admin) => (
                  <AdminCard key={admin.id} admin={admin} />
                ))
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Create Admin Modal */}
        <Dialog
          open={showCreateModal}
          onClose={closeCreateModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Create New Admin
            <IconButton
              onClick={closeCreateModal}
              size="small"
              sx={{
                color: "#6b7280",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            {renderForm(false)}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={closeCreateModal}
              disabled={submitting}
              sx={{
                textTransform: "none",
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              variant="contained"
              disabled={submitting}
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                fontSize: "0.875rem",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                backgroundColor: "#1A1A1A",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1A1A1A",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {submitting ? <CircularProgress size={16} color="inherit" /> : "Create Admin"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Admin Modal */}
        <Dialog
          open={showEditModal}
          onClose={closeEditModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            Edit Admin
            <IconButton
              onClick={closeEditModal}
              size="small"
              sx={{
                color: "#6b7280",
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            {renderForm(true)}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={closeEditModal}
              disabled={submitting}
              sx={{
                textTransform: "none",
                color: "#6b7280",
                fontSize: "0.875rem",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAdmin}
              variant="contained"
              disabled={submitting}
              sx={{
                textTransform: "none",
                borderRadius: 1.5,
                fontSize: "0.875rem",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                backgroundColor: "#1A1A1A",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#1A1A1A",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              {submitting ? <CircularProgress size={16} color="inherit" /> : "Update Admin"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AdminRoles