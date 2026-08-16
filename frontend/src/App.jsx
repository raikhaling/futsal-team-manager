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
      </Route>
    </Routes>
  );
}

export default App;
