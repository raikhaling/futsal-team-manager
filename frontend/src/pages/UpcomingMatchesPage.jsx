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
      <h1>Upcoming Matches</h1>

      {matches.length === 0 ? (
        <p>No upcoming matches.</p>
      ) : (
        <>
          <h2>Next Match</h2>

          <div>
            <h3>{matches[0].name}</h3>

            <p>📍 {matches[0].location}</p>

            <p>📅 {formatDate(matches[0].matchDate)}</p>

            <p>
              🕘 {formatTime(matches[0].startTime)} –{" "}
              {formatTime(matches[0].endTime)}
            </p>

            <button
              type="button"
              onClick={() => navigate(`/matches/${matches[0].id}`)}
            >
              View Details
            </button>
          </div>

          <hr />

          <h2>All Upcoming Matches</h2>

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
        </>
      )}
    </section>
  );
}

export default UpcomingMatchesPage;
