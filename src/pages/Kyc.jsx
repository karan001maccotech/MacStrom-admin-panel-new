"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import HomeIcon from "@mui/icons-material/Home"
import axiosInstance from "../utils/axios"

export default function KycTable() {
  const [kycData, setKycData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedKycId, setSelectedKycId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [updatingId, setUpdatingId] = useState(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const fetchKycData = async () => {
    setLoading(true)
    try {
      // Using axiosInstance instead of fetch
      const response = await axiosInstance.get("/userkyc/all")
      
      // With axios, the data is directly available in response.data
      // Sort by ID in ascending order
      const sortedData = response.data.data.sort((a, b) => a.id - b.id)
      setKycData(sortedData)
    } catch (err) {
      // Axios error handling
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data'
      setError(errorMessage)
      setSnackbarMessage(`Failed to fetch data: ${errorMessage}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKycData()
  }, [])

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget)
    setSelectedKycId(id)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedKycId(null)
  }

  const handleStatusUpdate = async (status) => {
    handleMenuClose()
    if (!selectedKycId) return

    setUpdatingId(selectedKycId)

    try {
      // Using axiosInstance for status update as well
      await axiosInstance.put(`/userkyc/status/${selectedKycId}`, { status })

      setSnackbarMessage(`KYC status updated to '${status}' successfully!`)
      setSnackbarSeverity("success")
      setSnackbarOpen(true)
      fetchKycData()
    } catch (err) {
      // Axios error handling
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update status'
      setSnackbarMessage(`Failed to update status: ${errorMessage}`)
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  // Mobile Card Component (only used on mobile)
  const MobileKycCard = ({ kyc }) => (
    <Card sx={{ mb: 2, borderRadius: 0 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            #{kyc.id} - {kyc.user_name}
          </Typography>
          <Chip
            label={kyc.status}
            color={kyc.status === "approved" ? "success" : kyc.status === "rejected" ? "error" : "warning"}
            size="small"
            sx={{ borderRadius: 0 }}
          />
        </Box>
        
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                {kyc.email}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {kyc.phone}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 16, mt: 0.5 }} />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.2, fontSize: '0.75rem' }}>
                {kyc.address}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ px: 0, minHeight: 32, '& .MuiAccordionSummary-content': { margin: '6px 0' } }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
              Document Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>Aadhaar</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.7rem' }}>
                  {kyc.aadhaar_card_number || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>PAN</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.7rem' }}>
                  {kyc.pan_card_number || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>Driving License</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.7rem' }}>
                  {kyc.driving_license_number || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>Voter ID</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontSize: '0.7rem' }}>
                  {kyc.voter_id_number || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1 }}>
        <IconButton
          aria-label="more"
          onClick={(event) => handleMenuClick(event, kyc.id)}
          disabled={updatingId === kyc.id}
          color="primary"
          size="small"
        >
          {updatingId === kyc.id ? <CircularProgress size={16} /> : <MoreVertIcon fontSize="small" />}
        </IconButton>
      </CardActions>
    </Card>
  )

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "64vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading KYC data...
        </Typography>
      </Box>
    )
  }

  if (error && kycData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "64vh",
          color: "error.main",
        }}
      >
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 0,
          overflow: "hidden",
          p: { xs: 1, sm: 2, md: 3 },
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}
        >
          User KYC Applications
        </Typography>

        {/* Show Mobile Cards only on mobile */}
        {isMobile ? (
          <Box>
            {kycData.map((kyc) => (
              <MobileKycCard key={kyc.id} kyc={kyc} />
            ))}
          </Box>
        ) : (
          /* Keep original table for desktop */
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 200px)",
              overflowX: "auto",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 0,
            }}
          >
            <Table stickyHeader aria-label="KYC data table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: 50,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 120,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 150,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 100,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 200,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Address
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 120,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Aadhaar
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 100,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    PAN
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 150,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Driving License
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 100,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Voter ID
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 100,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 100,
                      fontWeight: 700,
                      bgcolor: theme.palette.grey[100],
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kycData.map((kyc) => (
                  <TableRow
                    key={kyc.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {kyc.id}
                    </TableCell>
                    <TableCell>{kyc.user_name}</TableCell>
                    <TableCell>{kyc.email}</TableCell>
                    <TableCell>{kyc.phone}</TableCell>
                    <TableCell>{kyc.address}</TableCell>
                    <TableCell>{kyc.aadhaar_card_number || "N/A"}</TableCell>
                    <TableCell>{kyc.pan_card_number || "N/A"}</TableCell>
                    <TableCell>{kyc.driving_license_number || "N/A"}</TableCell>
                    <TableCell>{kyc.voter_id_number || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={kyc.status}
                        color={kyc.status === "approved" ? "success" : kyc.status === "rejected" ? "error" : "warning"}
                        size="small"
                        sx={{ borderRadius: 0 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="more"
                        aria-controls={`actions-menu-${kyc.id}`}
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, kyc.id)}
                        disabled={updatingId === kyc.id}
                        color="primary"
                      >
                        {updatingId === kyc.id ? <CircularProgress size={24} /> : <MoreVertIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            sx: {
              borderRadius: 0,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <MenuItem onClick={() => handleStatusUpdate("approved")}>
            <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
            Approve
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate("rejected")}>
            <CancelOutlinedIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
            Reject
          </MenuItem>
        </Menu>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}