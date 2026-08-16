import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminMatchApi from "../api/adminMatchApi";

function AdminEditMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    matchDate: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatch() {
      try {
        setLoading(true);
        setError("");

        const response = await adminMatchApi.getMatchById(id);
        const match = response.data;

        setFormData({
          name: match.name,
          location: match.location,
          matchDate: match.matchDate,
          startTime: match.startTime.slice(0, 5),
          endTime: match.endTime.slice(0, 5),
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load match.");
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
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
      setSaving(true);
      setError("");

      await adminMatchApi.updateMatch(id, formData);

      navigate("/admin/matches");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update match.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading match...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Edit Match</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Match Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="matchDate">Match Date</label>
          <input
            id="matchDate"
            name="matchDate"
            type="date"
            value={formData.matchDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default AdminEditMatchPage;
