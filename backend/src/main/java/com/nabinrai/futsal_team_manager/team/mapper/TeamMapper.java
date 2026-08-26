package com.nabinrai.futsal_team_manager.team.mapper;

import com.nabinrai.futsal_team_manager.team.dto.request.CreateTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamMemberResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamResponse;
import com.nabinrai.futsal_team_manager.team.entity.Team;
import com.nabinrai.futsal_team_manager.team.entity.TeamMembership;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TeamMapper {
    @Mapping(target = "id", source = "team.id")
    @Mapping(target = "name", source = "team.name")
    @Mapping(target = "description", source = "team.description")
    @Mapping(target = "joinCode", source = "team.joinCode")
    @Mapping(target = "role", source = "membership.role")
    TeamResponse toTeamResponse(Team team, TeamMembership membership);

    @Mapping(target = "name", source = "createTeamRequest.name")
    @Mapping(target = "description", source = "createTeamRequest.description")
    @Mapping(target = "joinCode", source = "joinCode")
    Team toTeamFromCreate(CreateTeamRequest createTeamRequest, String joinCode);

    @Mapping(target = "playerId", source = "player.id")
    @Mapping(target = "name", source = "player.name")
    @Mapping(target = "email", source = "player.email")
    @Mapping(target = "phone", source = "player.phone")
    @Mapping(target = "jerseyNumber", source = "player.jerseyNumber")
    @Mapping(target = "preferredPosition", source = "player.preferredPosition")
    @Mapping(target = "role", source = "role")
    TeamMemberResponse toTeamMemberResponse(TeamMembership membership);
}