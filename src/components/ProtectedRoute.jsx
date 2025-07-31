// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth  from "../hooks/useAuth"; // Assuming you have this hook to get user roles

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

export default ProtectedRoute;
