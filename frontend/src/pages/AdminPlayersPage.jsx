import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        setError("");

        const response = await adminPlayerApi.getAllPlayers(page, 10);

        console.log("Players:", response.data);

        const pageData = response.data;

        if (pageData.totalPages > 0 && page >= pageData.totalPages) {
          setPage(pageData.totalPages - 1);
          return;
        }

        setPlayers(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load players.");
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [page, refreshKey]);

  async function handleDelete(player) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${player.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setDeletingId(player.id);

    try {
      await adminPlayerApi.deletePlayer(player.id);

      setRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Failed to delete player.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p>Loading players...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Players</h1>

      <p>Total Players: {totalElements}</p>

      {deleteError && <p>{deleteError}</p>}

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
              <th>Actions</th>
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
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/players/${player.id}`)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/players/${player.id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(player)}
                    disabled={deletingId === player.id}
                  >
                    {deletingId === player.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        <button
          type="button"
          onClick={() => setPage((currentPage) => currentPage - 1)}
          disabled={page === 0}
        >
          Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => setPage((currentPage) => currentPage + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default AdminPlayersPage;
