import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import adminMatchApi from "../api/adminMatchApi";
import teamApi from "../api/teamApi";

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
        const response = await teamApi.getMembers();

        setPlayerOptions(
          response.data.map((member) => ({
            ...member,
            id: member.playerId,
          })),
        );
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
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading match...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const availablePlayers = playerOptions.filter(
    (player) =>
      !participants.some((participant) => participant.playerId === player.id),
  );

  return (
    <section className="mx-auto max-w-4xl space-y-8 py-4 sm:py-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {match.name}
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/matches/${match.id}/edit`}
              className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
            >
              Edit Match
            </Link>
            <Link
              to="/admin/matches"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to Matches
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {match.location}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Date
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {match.matchDate}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Time
            </span>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {match.startTime} – {match.endTime}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Confirmed Players
            </span>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              {match.confirmedPlayers}
            </p>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Waiting Players
            </span>
            <p className="mt-1 text-sm font-semibold text-amber-600">
              {match.waitingPlayers}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Add Player
        </h2>

        {addPlayerError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {addPlayerError}
          </div>
        )}

        <form
          onSubmit={handleAddPlayer}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <select
            value={selectedPlayerId}
            onChange={(event) => setSelectedPlayerId(event.target.value)}
            disabled={addingPlayer}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50"
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {addingPlayer ? "Adding..." : "Add Player"}
          </button>
        </form>

        {availablePlayers.length === 0 && (
          <p className="mt-3 text-xs text-slate-500">
            All players have already been added to this match.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Participants
        </h2>

        {attendanceError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {attendanceError}
          </div>
        )}

        <div className="mt-4">
          {participantsLoading ? (
            <p className="text-sm text-slate-500">Loading participants...</p>
          ) : participantsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {participantsError}
            </div>
          ) : participants.length === 0 ? (
            <p className="text-sm text-slate-500">
              No players have been added to this match yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Player</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {participants.map((participant) => {
                    const isUpdating =
                      updatingParticipationId === participant.id;

                    return (
                      <tr
                        key={participant.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {participant.playerName}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              participant.status === "ATTENDED"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : participant.status === "NO_SHOW"
                                  ? "border-rose-200 bg-rose-50 text-rose-700"
                                  : participant.status === "CONFIRMED"
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-slate-100 text-slate-700"
                            }`}
                          >
                            {participant.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {participant.status === "CONFIRMED" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleParticipationStatus(
                                    participant.id,
                                    "ATTENDED",
                                  )
                                }
                                disabled={isUpdating}
                                className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                              >
                                {isUpdating ? "Updating..." : "Attended"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleParticipationStatus(
                                    participant.id,
                                    "NO_SHOW",
                                  )
                                }
                                disabled={isUpdating}
                                className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
                              >
                                No Show
                              </button>
                            </div>
                          ) : participant.status === "ATTENDED" ? (
                            <span className="text-xs font-medium text-emerald-600">
                              Attendance marked
                            </span>
                          ) : participant.status === "NO_SHOW" ? (
                            <span className="text-xs font-medium text-rose-600">
                              No show marked
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No action available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminMatchDetailsPage;
