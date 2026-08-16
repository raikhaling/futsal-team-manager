import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminMatchApi from "../api/adminMatchApi";

function AdminCreateMatchPage() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    matchDate: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
      setLoading(true);
      setError("");

      await adminMatchApi.createMatch(formData);

      navigate("/admin/matches");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create match.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      {" "}
      <h1>Create Match</h1>
      {error && <p>{error}</p>}
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

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Match"}
        </button>
      </form>
    </section>
  );
}

export default AdminCreateMatchPage;
