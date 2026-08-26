import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import matchApi from "../api/matchApi";
import playerMatchApi from "../api/playerMatchApi";

function MatchDetailsPage() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [myParticipation, setMyParticipation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [participantsError, setParticipantsError] = useState("");
  const [participationError, setParticipationError] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  async function handleJoinMatch() {
    try {
      setJoining(true);
      setJoinError("");

      const response = await playerMatchApi.joinMatch(id);

      setMyParticipation({
        matchId: Number(id),
        status: response.data.status,
      });

      await refreshParticipants();
    } catch (error) {
      setJoinError(error.response?.data?.message || "Failed to join match.");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeaveMatch() {
    try {
      setLeaving(true);
      setLeaveError("");

      await playerMatchApi.leaveMatch(id);

      setMyParticipation({
        matchId: Number(id),
        status: "NOT_JOINED",
      });

      await refreshParticipants();
    } catch (error) {
      setLeaveError(error.response?.data?.message || "Failed to leave match.");
    } finally {
      setLeaving(false);
    }
  }

  async function refreshParticipants() {
    try {
      const response = await playerMatchApi.getMatchParticipants(id);

      setParticipants(response.data);
    } catch {
      setParticipantsError("Failed to refresh players joining this match.");
    }
  }

  useEffect(() => {
    async function loadMatchData() {
      try {
        setError("");

        const matchResponse = await matchApi.getMatchDetails(id);

        setMatch(matchResponse.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load match details.",
        );
      }
    }

    async function loadParticipants() {
      try {
        setParticipantsError("");

        const response = await playerMatchApi.getMatchParticipants(id);

        setParticipants(response.data);
      } catch {
        setParticipantsError("Failed to load players joining this match.");
        setParticipants([]);
      }
    }

    async function loadMyParticipation() {
      try {
        setParticipationError("");

        const response = await playerMatchApi.getMyParticipation(id);

        setMyParticipation(response.data);
      } catch {
        setParticipationError("Failed to load your participation status.");
        setMyParticipation(null);
      }
    }

    async function loadPage() {
      setLoading(true);

      await Promise.all([
        loadMatchData(),
        loadParticipants(),
        loadMyParticipation(),
      ]);

      setLoading(false);
    }

    loadPage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading match details...</p>
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

  const confirmedParticipants = participants.filter(
    (participant) => participant.status === "CONFIRMED",
  );

  const status = myParticipation?.status;

  const statusStyles = {
    CONFIRMED: "border-green-200 bg-green-50 text-green-700",
    WAITING_LIST: "border-yellow-200 bg-yellow-50 text-yellow-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
    ATTENDED: "border-blue-200 bg-blue-50 text-blue-700",
    NO_SHOW: "border-slate-300 bg-slate-100 text-slate-700",
  };

  return (
    <section className="space-y-8">
      <div>
        <Link
          to="/matches"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Upcoming Matches
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {match.name}
        </h1>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </p>
            <p className="mt-2 font-medium text-slate-900">{match.location}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </p>
            <p className="mt-2 font-medium text-slate-900">{match.matchDate}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Time
            </p>
            <p className="mt-2 font-medium text-slate-900">
              {match.startTime} - {match.endTime}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          My Participation
        </h2>

        {participationError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {participationError}
          </div>
        ) : status === "NOT_JOINED" || status === "CANCELLED" ? (
          <div className="mt-4">
            <p className="text-sm text-slate-600">
              {status === "CANCELLED"
                ? "You cancelled your participation in this match."
                : "You have not joined this match."}
            </p>

            {joinError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {joinError}
              </div>
            )}

            <button
              type="button"
              onClick={handleJoinMatch}
              disabled={joining}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {joining
                ? "Joining..."
                : status === "CANCELLED"
                  ? "Join Match Again"
                  : "Join Match"}
            </button>
          </div>
        ) : status === "WAITING_LIST" ? (
          <div className="mt-4">
            <span className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide border-yellow-200 bg-yellow-50 text-yellow-700">
              Waiting List
            </span>

            <p className="mt-4 text-sm text-slate-600">
              The match is currently full. You are on the waiting list.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            {status && (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  statusStyles[status] ||
                  "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {status.replace("_", " ")}
              </span>
            )}

            {leaveError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {leaveError}
              </div>
            )}

            {status === "CONFIRMED" && (
              <button
                type="button"
                onClick={handleLeaveMatch}
                disabled={leaving}
                className="mt-5 w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {leaving ? "Leaving..." : "Leave Match"}
              </button>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Players Joining
          </h2>

          <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            {confirmedParticipants.length} Confirmed
          </span>
        </div>

        {participantsError ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {participantsError}
          </div>
        ) : confirmedParticipants.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              No players have joined yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <ol className="divide-y divide-slate-200">
              {confirmedParticipants.map((participant, index) => (
                <li
                  key={participant.id}
                  className="flex items-center gap-4 px-4 py-4 sm:px-6"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </span>

                  <span className="font-medium text-slate-800">
                    {participant.playerName}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </section>
  );
}

export default MatchDetailsPage;
