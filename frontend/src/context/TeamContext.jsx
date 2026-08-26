import { useContext, useEffect, useState } from "react";
import teamApi from "../api/teamApi";
import AuthContext from "./authContext";
import TeamContext from "./teamContext";

const SELECTED_TEAM_KEY = "futsal.selectedTeamId";

export function TeamProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamIdState] = useState(() =>
    localStorage.getItem(SELECTED_TEAM_KEY),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTeams() {
      if (!user) {
        setTeams([]);
        setSelectedTeamIdState(null);
        localStorage.removeItem(SELECTED_TEAM_KEY);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await teamApi.getMyTeams();
        const nextTeams = response.data || [];
        const storedTeamId = localStorage.getItem(SELECTED_TEAM_KEY);
        const selectedTeam = nextTeams.find(
          (team) => String(team.id) === String(storedTeamId),
        );
        const nextTeamId = selectedTeam?.id ?? nextTeams[0]?.id ?? null;

        setTeams(nextTeams);
        setSelectedTeamIdState(nextTeamId ? String(nextTeamId) : null);
        if (nextTeamId) {
          localStorage.setItem(SELECTED_TEAM_KEY, String(nextTeamId));
        } else {
          localStorage.removeItem(SELECTED_TEAM_KEY);
        }
      } catch (requestError) {
        setTeams([]);
        setSelectedTeamIdState(null);
        setError(requestError.response?.data?.message || "Failed to load teams.");
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [user]);

  function setSelectedTeamId(teamId) {
    const nextTeamId = teamId ? String(teamId) : null;
    setSelectedTeamIdState(nextTeamId);
    if (nextTeamId) {
      localStorage.setItem(SELECTED_TEAM_KEY, nextTeamId);
    } else {
      localStorage.removeItem(SELECTED_TEAM_KEY);
    }
  }

  const selectedTeam = teams.find(
    (team) => String(team.id) === String(selectedTeamId),
  );

  return (
    <TeamContext.Provider
      value={{
        teams,
        selectedTeam,
        selectedTeamId,
        setSelectedTeamId,
        loading,
        error,
        setTeams,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
