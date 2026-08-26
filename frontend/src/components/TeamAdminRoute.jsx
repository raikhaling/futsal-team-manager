import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTeam } from "../context/useTeam";

function TeamAdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { selectedTeam, loading: teamLoading } = useTeam();

  if (loading || teamLoading) {
    return <p>Checking team access...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.systemRole !== "SYSTEM_ADMIN" &&
    selectedTeam?.role !== "TEAM_ADMIN"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default TeamAdminRoute;
