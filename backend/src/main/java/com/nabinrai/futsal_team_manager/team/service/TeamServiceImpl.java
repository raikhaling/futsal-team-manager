package com.nabinrai.futsal_team_manager.team.service;

import com.nabinrai.futsal_team_manager.common.enums.TeamRole;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;
import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.common.service.CurrentPlayerService;
import com.nabinrai.futsal_team_manager.common.service.TeamContextService;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.team.dto.request.CreateTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.JoinTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.UpdateTeamMemberRoleRequest;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamMemberResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamJoinCodeResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamResponse;
import com.nabinrai.futsal_team_manager.team.entity.Team;
import com.nabinrai.futsal_team_manager.team.entity.TeamMembership;
import com.nabinrai.futsal_team_manager.team.mapper.TeamMapper;
import com.nabinrai.futsal_team_manager.team.repository.TeamMembershipRepository;
import com.nabinrai.futsal_team_manager.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final TeamMembershipRepository membershipRepository;
    private final CurrentPlayerService currentPlayerService;
    private final TeamMapper teamMapper;
    private final TeamContextService teamContextService;

    @Override
    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {

        Player player = currentPlayerService.getCurrentPlayer();

        Team team = teamMapper.toTeamFromCreate(request, generateJoinCode());

        teamRepository.save(team);

        TeamMembership membership = getBuild(team, player, TeamRole.TEAM_ADMIN);

        membershipRepository.save(membership);

        return teamMapper.toTeamResponse(team, membership);
    }


    @Override
    public TeamResponse joinTeam(JoinTeamRequest request) {

        Player player = currentPlayerService.getCurrentPlayer();

        Team team = teamRepository
                .findByJoinCode(request.joinCode().trim().toUpperCase())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invalid team join code"
                        )
                );

        if (membershipRepository.existsByTeamIdAndPlayerId(
                team.getId(),
                player.getId()
        )) {
            throw new IllegalStateException(
                    "You are already a member of this team"
            );
        }

        TeamMembership membership = getBuild(team, player, TeamRole.PLAYER);

        membershipRepository.save(membership);

        return teamMapper.toTeamResponse(team, membership);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getMyTeams() {

        Long playerId = currentPlayerService.getCurrentPlayerId();

        if (currentPlayerService.getCurrentPlayer().getSystemRole() == SystemRole.SYSTEM_ADMIN) {
            return teamRepository.findAll()
                    .stream()
                    .map(team -> new TeamResponse(
                            team.getId(),
                            team.getName(),
                            team.getDescription(),
                            team.getJoinCode(),
                            null
                    ))
                    .toList();
        }

        return membershipRepository
                .findAllByPlayerId(playerId)
                .stream()
                .map(membership ->
                        teamMapper.toTeamResponse(
                                membership.getTeam(),
                                membership
                        )
                )
                .toList();
    }

        @Override
        @Transactional(readOnly = true)
        public TeamJoinCodeResponse getCurrentTeamJoinCode() {

                return new TeamJoinCodeResponse(
                                teamContextService.getCurrentTeam().getJoinCode()
                );
        }

        @Override
        public void leaveTeam() {

        TeamMembership membership =
                teamContextService.getCurrentMembership();

        if (membership.getRole() == TeamRole.TEAM_ADMIN) {

            long adminCount =
                    membershipRepository.countByTeamIdAndRole(
                            membership.getTeam().getId(),
                            TeamRole.TEAM_ADMIN
                    );

            if (adminCount <= 1) {
                throw new IllegalStateException(
                        "The last team admin cannot leave the team"
                );
            }
        }
        if (!membershipRepository.existsByTeamIdAndPlayerId(
                membership.getTeam().getId(),
                membership.getPlayer().getId())) {
            throw new IllegalArgumentException("Player is not in the team or has already left the team");
        }

        membershipRepository.delete(membership);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers() {

        Long teamId = teamContextService.getCurrentTeamId();
                if (!currentPlayerService.isSystemAdmin()) {
                        currentPlayerService.getMembership(teamId);
                }

        return membershipRepository
                .findAllByTeamId(teamId)
                .stream()
                .map(teamMapper::toTeamMemberResponse)
                .toList();
    }

    @Override
    public void removeMember(Long playerId) {
        Long teamId = teamContextService.getCurrentTeamId();

        TeamMembership membership =
                membershipRepository
                        .findByTeamIdAndPlayerId(teamId, playerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Player is not a member of this team"
                                )
                        );

        if (membership.getRole() == TeamRole.TEAM_ADMIN) {

            long adminCount =
                    membershipRepository.countByTeamIdAndRole(
                            teamId,
                            TeamRole.TEAM_ADMIN
                    );

            if (adminCount <= 1) {
                throw new IllegalStateException(
                        "The last team admin cannot be removed"
                );
            }
        }

        membershipRepository.delete(membership);
    }

    @Override
    public void updateMemberRole(
            Long playerId,
            UpdateTeamMemberRoleRequest request
    ) {

        Long teamId = teamContextService.getCurrentTeamId();

        TeamMembership membership =
                membershipRepository
                        .findByTeamIdAndPlayerId(teamId, playerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Player is not a member of this team"
                                )
                        );

        TeamRole currentRole = membership.getRole();
        TeamRole newRole = request.role();

        if (currentRole == newRole) {
            return;
        }

        /*
         * Prevent the last TEAM_ADMIN from being demoted.
         */
        if (currentRole == TeamRole.TEAM_ADMIN
                && newRole == TeamRole.PLAYER) {

            long adminCount =
                    membershipRepository.countByTeamIdAndRole(
                            teamId,
                            TeamRole.TEAM_ADMIN
                    );

            if (adminCount <= 1) {
                throw new IllegalStateException(
                        "The last team admin cannot be demoted"
                );
            }
        }

        membership.setRole(newRole);

        membershipRepository.save(membership);
    }

    private String generateJoinCode() {

        String code;

        do {
            code = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();

        } while (teamRepository.existsByJoinCode(code));

        return code;
    }

    private TeamMembership getBuild(Team team, Player player, TeamRole teamRole) {
        return TeamMembership.builder()
                .team(team)
                .player(player)
                .role(teamRole)
                .build();
    }
}