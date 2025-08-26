"use client"

import { useState } from "react"
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
} from "@mui/material"
import { Users, Plus, Edit, UserX, Trash2, X } from "lucide-react"

const AdminRoles = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  // State management
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Admin", // Auto-select Admin by default
    permissions: {
      manageUsers: true,
      manageFinance: true,
      viewReports: true,
      manageTournaments: false,
      manageSettings: false,
    },
  })
  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@battlenation.com",
      role: "Super Admin",
      status: "active",
      permissions: 5,
      lastLogin: "2024-01-08 14:32:15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@battlenation.com",
      role: "Admin",
      status: "active",
      permissions: 3,
      lastLogin: "2024-01-07 09:45:22",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePermissionChange = (permission, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }))
  }

  const handleCreateAdmin = () => {
    const newAdmin = {
      id: admins.length + 1,
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: "active",
      permissions: Object.values(formData.permissions).filter(Boolean).length,
      lastLogin: "Just created",
      avatar: `/placeholder.svg?height=40&width=40&query=${formData.fullName}`,
    }
    setAdmins([...admins, newAdmin])
    setShowCreateModal(false)
    // Reset form with Admin pre-selected
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "Admin", // Keep Admin as default
      permissions: {
        manageUsers: true,
        manageFinance: true,
        viewReports: true,
        manageTournaments: false,
        manageSettings: false,
      },
    })
  }

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id))
  }

  const AdminCard = ({ admin }) => (
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
            src={admin.avatar}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#3b82f6",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {admin.name.charAt(0)}
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
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                fontSize: "0.75rem",
              }}
            >
              Last login: {admin.lastLogin}
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
                Admin Users
              </Typography>
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

            {/* Admin List */}
            <Box>
              {admins.map((admin) => (
                <AdminCard key={admin.id} admin={admin} />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Create Admin Modal */}
        <Dialog
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
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
              onClick={() => setShowCreateModal(false)}
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
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              Add a new admin user with specific permissions
            </Typography>
            <Stack spacing={3}>
              {/* Name and Email */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
              </Stack>

              {/* Password and Role */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
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
                    onChange={(e) => handleInputChange("role", e.target.value)}
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
              </Stack>

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
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setShowCreateModal(false)}
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
              Create Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default AdminRoles
