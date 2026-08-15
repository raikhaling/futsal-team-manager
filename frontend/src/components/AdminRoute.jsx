import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
