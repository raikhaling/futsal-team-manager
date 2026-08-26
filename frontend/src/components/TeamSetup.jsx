import { useState } from "react";
import teamApi from "../api/teamApi";
import { useTeam } from "../context/useTeam";

function TeamSetup() {
  const { teams, setTeams, setSelectedTeamId } = useTeam();
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function selectTeamRequest(request) {
    try {
      setSubmitting(true);
      setError("");
      const response = await request;
      const team = response.data;
      setTeams((currentTeams) => [
        ...currentTeams.filter((currentTeam) => currentTeam.id !== team.id),
        team,
      ]);
      setSelectedTeamId(team.id);
      setTeamName("");
      setJoinCode("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Team request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCreate(event) {
    event.preventDefault();
    selectTeamRequest(teamApi.createTeam({ name: teamName }));
  }

  function handleJoin(event) {
    event.preventDefault();
    selectTeamRequest(teamApi.joinTeam(joinCode));
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {teams.length > 0 ? "Manage teams" : "Choose a team"}
          </h1>
        <p className="mt-1 text-sm text-slate-600">
            Create a team or join another one with its invite code. Select a
            team from the navigation to view its matches.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Create a team</h2>
          <input
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="Team name"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Create team
          </button>
        </form>

        <form onSubmit={handleJoin} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Join a team</h2>
          <input
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value)}
            placeholder="Invite code"
            required
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Join team
          </button>
        </form>
      </div>
    </section>
  );
}

export default TeamSetup;
