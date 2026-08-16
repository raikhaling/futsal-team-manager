import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header>
        <nav>
          {user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/matches">Matches</Link>
              <Link to="/profile">My Profile</Link>
              <Link to="/attendance">Attendance</Link>
              <Link to="/leaderboard">Leaderboard</Link>

              {user.role === "ADMIN" && (
                <>
                  <Link to="/admin/players">Manage Players</Link>
                  <Link to="/admin/matches">Manage Matches</Link>
                </>
              )}

              <span>Welcome, {user.name}</span>

              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
