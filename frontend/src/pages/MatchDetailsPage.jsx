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
      ) : myParticipation?.status === "NOT_JOINED" ? (
        <p>You have not joined this match.</p>
      ) : (
        <p>
          <strong>Status:</strong> {myParticipation?.status}
        </p>
      )}

      <hr />

      <h2>Players Joining ({participants.length})</h2>

      {participantsError ? (
        <p>{participantsError}</p>
      ) : participants.length === 0 ? (
        <p>No players have joined yet.</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>
              {participant.playerName} - {participant.status}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <Link to="/matches">Back to Upcoming Matches</Link>
    </section>
  );
}

export default MatchDetailsPage;
