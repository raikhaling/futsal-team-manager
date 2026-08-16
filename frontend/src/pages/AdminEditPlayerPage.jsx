import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminEditPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredPosition: "",
    jerseyNumber: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        setError("");

        const response = await adminPlayerApi.getPlayerById(id);
        const player = response.data;

        setFormData({
          name: player.name ?? "",
          email: player.email ?? "",
          phone: player.phone ?? "",
          preferredPosition: player.preferredPosition ?? "",
          jerseyNumber: player.jerseyNumber ?? "",
          role: player.role ?? "",
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load player.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayer();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const updateData = {
        ...formData,
        jerseyNumber:
          formData.jerseyNumber === "" ? null : Number(formData.jerseyNumber),
      };

      await adminPlayerApi.updatePlayer(id, updateData);

      navigate(`/admin/players/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update player.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading player...</p>;
  }

  if (error && !formData.name) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Edit Player</h1>

      {error && <p>{error}</p>}

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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
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
            <option value="">Select position</option>
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
          />
        </div>

        <div>
          <label htmlFor="role">Role</label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="PLAYER">Player</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Player"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/admin/players/${id}`)}
          disabled={submitting}
        >
          Cancel
        </button>
      </form>
    </section>
  );
}

export default AdminEditPlayerPage;
