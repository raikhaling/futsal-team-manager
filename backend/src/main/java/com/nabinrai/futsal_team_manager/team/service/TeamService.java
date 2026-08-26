package com.nabinrai.futsal_team_manager.team.service;

import com.nabinrai.futsal_team_manager.team.dto.request.CreateTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.JoinTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.UpdateTeamMemberRoleRequest;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamMemberResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamJoinCodeResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamResponse;

import java.util.List;

public interface TeamService {

    TeamResponse createTeam(CreateTeamRequest request);

    TeamResponse joinTeam(JoinTeamRequest request);

    List<TeamResponse> getMyTeams();

    TeamJoinCodeResponse getCurrentTeamJoinCode();

    void leaveTeam();

    List<TeamMemberResponse> getTeamMembers();

    void removeMember(Long playerId);

    void updateMemberRole(
            Long playerId,
            UpdateTeamMemberRoleRequest request
    );
}