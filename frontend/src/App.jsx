import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import AdminPlayersPage from "./pages/AdminPlayersPage";
import AdminRoute from "./components/AdminRoute";
import AdminPlayerDetailsPage from "./pages/AdminPlayerDetailsPage";
import AdminEditPlayerPage from "./pages/AdminEditPlayerPage";
import UpcomingMatchesPage from "./pages/UpcomingMatchesPage";
import MyAttendancePage from "./pages/MyAttendancePage";
import AttendanceLeaderboardPage from "./pages/AttendanceLeaderboardPage";
import AdminMatchesPage from "./pages/AdminMatchesPage";
import AdminCreateMatchPage from "./pages/AdminCreateMatchPage";
import AdminEditMatchPage from "./pages/AdminEditMatchPage";
import AdminMatchDetailsPage from "./pages/AdminMatchDetailsPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players"
          element={
            <ProtectedRoute>
              <AdminPlayersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players"
          element={
            <AdminRoute>
              <AdminPlayersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/players/:id"
          element={
            <AdminRoute>
              <AdminPlayerDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/players/:id/edit"
          element={
            <AdminRoute>
              <AdminEditPlayerPage />
            </AdminRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <UpcomingMatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <MyAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <AttendanceLeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminMatchesPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches/create"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminCreateMatchPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches/:id/edit"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminEditMatchPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches/:id"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminMatchDetailsPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
