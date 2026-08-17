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
      } catch (error) {
        console.error("Failed to load participation:", error);

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
    return <p>Loading match details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const confirmedParticipants = participants.filter(
    (participant) => participant.status === "CONFIRMED",
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
        <strong>Time:</strong> {match.startTime} - {match.endTime}
      </p>

      <hr />

      <h2>My Participation</h2>

      {participationError ? (
        <p>{participationError}</p>
      ) : myParticipation?.status === "NOT_JOINED" ||
        myParticipation?.status === "CANCELLED" ? (
        <>
          {myParticipation?.status === "CANCELLED" ? (
            <p>You cancelled your participation in this match.</p>
          ) : (
            <p>You have not joined this match.</p>
          )}

          {joinError && <p>{joinError}</p>}

          <button type="button" onClick={handleJoinMatch} disabled={joining}>
            {joining
              ? "Joining..."
              : myParticipation?.status === "CANCELLED"
                ? "Join Match Again"
                : "Join Match"}
          </button>
        </>
      ) : myParticipation?.status === "WAITING_LIST" ? (
        <>
          <p>
            <strong>Status:</strong> WAITING LIST
          </p>

          <p>The match is currently full. You are on the waiting list.</p>
        </>
      ) : (
        <>
          <p>
            <strong>Status:</strong> {myParticipation?.status}
          </p>

          {leaveError && <p>{leaveError}</p>}

          {myParticipation?.status === "CONFIRMED" && (
            <button type="button" onClick={handleLeaveMatch} disabled={leaving}>
              {leaving ? "Leaving..." : "Leave Match"}
            </button>
          )}
        </>
      )}

      <hr />

      <h2>Players Joining ({confirmedParticipants.length})</h2>

      {participantsError ? (
        <p>{participantsError}</p>
      ) : confirmedParticipants.length === 0 ? (
        <p>No players have joined yet.</p>
      ) : (
        <ol>
          {confirmedParticipants.map((participant) => (
            <li key={participant.id}>{participant.playerName}</li>
          ))}
        </ol>
      )}

      <hr />

      <Link to="/matches">Back to Upcoming Matches</Link>
    </section>
  );
}

export default MatchDetailsPage;
