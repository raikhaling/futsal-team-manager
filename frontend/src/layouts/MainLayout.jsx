import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="text-xl">⚽</span>
            <span>Futsal Manager</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Home
                </Link>

                <Link
                  to="/matches"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Matches
                </Link>

                <Link
                  to="/profile"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  My Profile
                </Link>

                <Link
                  to="/attendance"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Attendance
                </Link>

                <Link
                  to="/leaderboard"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Leaderboard
                </Link>

                {user.role === "ADMIN" && (
                  <>
                    <Link
                      to="/admin/players"
                      className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                      Manage Players
                    </Link>

                    <Link
                      to="/admin/matches"
                      className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                    >
                      Manage Matches
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                  <span className="text-sm text-slate-600">
                    Welcome, {user.name}
                  </span>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Home
                  </Link>

                  <Link
                    to="/matches"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Matches
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/attendance"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Attendance
                  </Link>

                  <Link
                    to="/leaderboard"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Leaderboard
                  </Link>

                  {user.role === "ADMIN" && (
                    <>
                      <div className="my-2 border-t border-slate-200" />

                      <Link
                        to="/admin/players"
                        onClick={closeMenu}
                        className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Manage Players
                      </Link>

                      <Link
                        to="/admin/matches"
                        onClick={closeMenu}
                        className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Manage Matches
                      </Link>
                    </>
                  )}

                  <div className="my-2 border-t border-slate-200" />

                  <div className="px-3 py-2 text-sm text-slate-500">
                    Welcome, {user.name}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
