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
    <section>
      <h1>My Profile</h1>

      {!editing ? (
        <>
          <div>
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Phone:</strong> {user.phone}
            </p>

            <p>
              <strong>Preferred Position:</strong> {user.preferredPosition}
            </p>

            <p>
              <strong>Jersey Number:</strong> {user.jerseyNumber}
            </p>

            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          <button type="button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <button type="button" onClick={() => setChangingPassword(true)}>
            Change Password
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="preferredPosition">Preferred Position</label>

            <select
              id="preferredPosition"
              name="preferredPosition"
              value={formData.preferredPosition}
              onChange={handleChange}
              required
            >
              <option value="GOALKEEPER">Goalkeeper</option>
              <option value="DEFENDER">Defender</option>
              <option value="MIDFIELDER">Midfielder</option>
              <option value="FORWARD">Forward</option>
            </select>
          </div>

          <div>
            <label htmlFor="jerseyNumber">Jersey Number</label>
            <input
              id="jerseyNumber"
              name="jerseyNumber"
              type="number"
              value={formData.jerseyNumber}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </form>
      )}
      {changingPassword && (
        <form onSubmit={handlePasswordSubmit}>
          <h2>Change Password</h2>

          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              minLength="8"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          {passwordError && <p>{passwordError}</p>}

          <button type="submit" disabled={passwordLoading}>
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
          >
            Cancel
          </button>
        </form>
      )}

      {passwordSuccess && <p>{passwordSuccess}</p>}
    </section>
  );
}

export default ProfilePage;
