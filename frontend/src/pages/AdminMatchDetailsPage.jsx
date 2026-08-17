import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import adminMatchApi from "../api/adminMatchApi";
import adminPlayerApi from "../api/adminPlayerApi";

function AdminMatchDetailsPage() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [participantsError, setParticipantsError] = useState("");
  const [playerOptions, setPlayerOptions] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [addPlayerError, setAddPlayerError] = useState("");
  const [updatingParticipationId, setUpdatingParticipationId] = useState(null);
  const [attendanceError, setAttendanceError] = useState("");

  useEffect(() => {
    async function loadPlayerOptions() {
      try {
        const response = await adminPlayerApi.getPlayerOptions();

        setPlayerOptions(response.data);
      } catch (error) {
        setAddPlayerError(
          error.response?.data?.message || "Failed to load player options.",
        );
      }
    }

    loadPlayerOptions();
  }, []);
  useEffect(() => {
    async function loadParticipants() {
      try {
        setParticipantsLoading(true);
        setParticipantsError("");

        const response = await adminMatchApi.getParticipants(id);

        setParticipants(response.data);
      } catch (error) {
        setParticipantsError(
          error.response?.data?.message || "Failed to load participants.",
        );
      } finally {
        setParticipantsLoading(false);
      }
    }

    loadParticipants();
  }, [id]);

  useEffect(() => {
    async function loadMatch() {
      try {
        setLoading(true);
        setError("");

        const response = await adminMatchApi.getMatchById(id);

        setMatch(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load match.");
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);
  async function handleParticipationStatus(participationId, status) {
    try {
      setUpdatingParticipationId(participationId);
      setAttendanceError("");

      let response;

      if (status === "ATTENDED") {
        response = await adminMatchApi.markAttendance(participationId);
      } else if (status === "NO_SHOW") {
        response = await adminMatchApi.markNoShow(participationId);
      }

      const updatedParticipation = response.data;

      setParticipants((currentParticipants) =>
        currentParticipants.map((participant) =>
          participant.id === updatedParticipation.id
            ? updatedParticipation
            : participant,
        ),
      );
    } catch (error) {
      console.log("Attendance error:", error.response?.data);

      setAttendanceError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update participation status.",
      );
    } finally {
      setUpdatingParticipationId(null);
    }
  }

  async function handleAddPlayer(event) {
    event.preventDefault();

    if (!selectedPlayerId) {
      setAddPlayerError("Please select a player.");
      return;
    }

    try {
      setAddingPlayer(true);
      setAddPlayerError("");

      await adminMatchApi.addPlayer(id, Number(selectedPlayerId));

      const response = await adminMatchApi.getParticipants(id);

      setParticipants(response.data);
      setSelectedPlayerId("");
    } catch (error) {
      setAddPlayerError(
        error.response?.data?.message || "Failed to add player to match.",
      );
    } finally {
      setAddingPlayer(false);
    }
  }

  if (loading) {
    return <p>Loading match...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const availablePlayers = playerOptions.filter(
    (player) =>
      !participants.some((participant) => participant.playerId === player.id),
  );

  return (
    <section>
      <h1>{match.name}</h1>

      <p>
        <strong>Location:</strong> {match.location}
      </p>

      <p>
        <strong>Date:</strong> {match.matchDate}
      </p>

      <p>
        <strong>Start Time:</strong> {match.startTime}
      </p>

      <p>
        <strong>End Time:</strong> {match.endTime}
      </p>

      <p>
        <strong>Confirmed Players:</strong> {match.confirmedPlayers}
      </p>

      <p>
        <strong>Waiting Players:</strong> {match.waitingPlayers}
      </p>

      <Link to={`/admin/matches/${match.id}/edit`}>Edit Match</Link>

      <br />

      <Link to="/admin/matches">Back to Matches</Link>
      <hr />
      <hr />

      <h2>Add Player</h2>

      {addPlayerError && <p>{addPlayerError}</p>}

      <form onSubmit={handleAddPlayer}>
        <select
          value={selectedPlayerId}
          onChange={(event) => setSelectedPlayerId(event.target.value)}
          disabled={addingPlayer}
        >
          <option value="">Select a player</option>

          {availablePlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={
            !selectedPlayerId || addingPlayer || availablePlayers.length === 0
          }
        >
          {addingPlayer ? "Adding..." : "Add Player"}
        </button>
      </form>
      {availablePlayers.length === 0 && (
        <p>All players have already been added to this match.</p>
      )}

      <h2>Participants</h2>

      {attendanceError && <p>{attendanceError}</p>}

      {participantsLoading ? (
        <p>Loading participants...</p>
      ) : participantsError ? (
        <p>{participantsError}</p>
      ) : participants.length === 0 ? (
        <p>No players have been added to this match yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {participants.map((participant) => {
              const isUpdating = updatingParticipationId === participant.id;

              return (
                <tr key={participant.id}>
                  <td>{participant.playerName}</td>

                  <td>{participant.status}</td>

                  <td>
                    {participant.status === "CONFIRMED" ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleParticipationStatus(
                              participant.id,
                              "ATTENDED",
                            )
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Attended"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleParticipationStatus(participant.id, "NO_SHOW")
                          }
                          disabled={isUpdating}
                        >
                          No Show
                        </button>
                      </>
                    ) : participant.status === "ATTENDED" ? (
                      <span>Attendance marked</span>
                    ) : participant.status === "NO_SHOW" ? (
                      <span>No show marked</span>
                    ) : (
                      <span>No action available</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AdminMatchDetailsPage;
