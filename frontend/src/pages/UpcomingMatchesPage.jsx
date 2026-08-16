import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import matchApi from "../api/matchApi";

function UpcomingMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const response = await matchApi.getUpcomingMatches();

        setMatches(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load upcoming matches.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return <p>Loading upcoming matches...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      {" "}
      <h1>Upcoming Matches</h1>
      {matches.length === 0 ? (
        <p>No upcoming matches.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.matchDate}</td>
                <td>{match.startTime}</td>
                <td>{match.endTime}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/matches/${match.id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default UpcomingMatchesPage;
