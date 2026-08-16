import { useEffect, useState } from "react";
import adminMatchApi from "../api/adminMatchApi";
import { Link } from "react-router-dom";

function AdminMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const response = await adminMatchApi.getAllMatches();

        setMatches(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return (
    <section>
      {" "}
      <h1>Manage Matches</h1>
      <Link to="/admin/matches/create">Create Match</Link>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.name}</td>
                <td>{match.location}</td>
                <td>{formatDate(match.matchDate)}</td>
                <td>
                  {formatTime(match.startTime)} – {formatTime(match.endTime)}
                </td>
                <td>
                  <Link to={`/admin/matches/${match.id}`}>Manage</Link>

                  {" | "}

                  <Link to={`/admin/matches/${match.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AdminMatchesPage;
