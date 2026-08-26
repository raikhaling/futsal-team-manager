import { useState } from "react";
import authApi from "../api/authApi";
import { useAuth } from "../context/useAuth";

function ProfilePage() {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((currentPasswordData) => ({
      ...currentPasswordData,
      [name]: value,
    }));
  }

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || "",
    preferredPosition: user.preferredPosition,
    jerseyNumber: user.jerseyNumber,
  });

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setChangingPassword(false);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: name === "jerseyNumber" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await authApi.updateProfile(formData);

      setUser(response.data);
      setEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData({
      name: user.name,
      phone: user.phone || "",
      preferredPosition: user.preferredPosition,
      jerseyNumber: user.jerseyNumber,
    });

    setError("");
    setEditing(false);
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6 py-4 sm:py-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Profile
        </h1>

        {passwordSuccess && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {passwordSuccess}
          </div>
        )}

        {!editing ? (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.email}
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Phone
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.phone || "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Preferred Position
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.preferredPosition}
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jersey Number
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.jerseyNumber ?? "N/A"}
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </span>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.systemRole}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setChangingPassword(true)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="preferredPosition"
                  className="block text-sm font-medium text-slate-700"
                >
                  Preferred Position
                </label>
                <select
                  id="preferredPosition"
                  name="preferredPosition"
                  value={formData.preferredPosition}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="GOALKEEPER">Goalkeeper</option>
                  <option value="DEFENDER">Defender</option>
                  <option value="MIDFIELDER">Midfielder</option>
                  <option value="FORWARD">Forward</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="jerseyNumber"
                  className="block text-sm font-medium text-slate-700"
                >
                  Jersey Number
                </label>
                <input
                  id="jerseyNumber"
                  name="jerseyNumber"
                  type="number"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {changingPassword && (
          <form
            onSubmit={handlePasswordSubmit}
            className="mt-8 border-t border-slate-200 pt-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Change Password
            </h2>

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                minLength="8"
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {passwordError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {passwordError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setChangingPassword(false);
                  setPasswordError("");
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                disabled={passwordLoading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
