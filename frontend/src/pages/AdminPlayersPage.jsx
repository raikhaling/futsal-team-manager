import { useEffect, useState } from "react";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlayers() {
      try {
        const response = await adminPlayerApi.getAllPlayers(page, 10);

        console.log("Players:", response.data);

        setPlayers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load players.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [page]);

  if (loading) {
    return <p>Loading players...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Players</h1>

      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Jersey Number</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.id}</td>
                <td>{player.name}</td>
                <td>{player.email}</td>
                <td>{player.phone || "-"}</td>
                <td>{player.preferredPosition}</td>
                <td>{player.jerseyNumber ?? "-"}</td>
                <td>{player.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AdminPlayersPage;
