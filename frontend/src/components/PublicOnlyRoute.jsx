import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking session...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicOnlyRoute;
