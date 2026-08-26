package com.nabinrai.futsal_team_manager.common.service;

import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.team.entity.Team;
import com.nabinrai.futsal_team_manager.team.entity.TeamMembership;
import com.nabinrai.futsal_team_manager.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class TeamContextService {

    private final CurrentPlayerService currentPlayerService;
    private final TeamRepository teamRepository;

    public Long getCurrentTeamId() {

        String teamIdHeader =
                ((ServletRequestAttributes)
                        RequestContextHolder
                                .currentRequestAttributes())
                        .getRequest()
                        .getHeader("X-Team-Id");

        if (teamIdHeader == null) {
            throw new IllegalArgumentException(
                    "X-Team-Id header is required"
            );
        }

        Long teamId;

        try {
            teamId = Long.valueOf(teamIdHeader);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(
                    "Invalid X-Team-Id"
            );
        }

        if (!currentPlayerService.isSystemAdmin()) {
            currentPlayerService.getMembership(teamId);
        }
        return teamId;
    }

    public Team getCurrentTeam() {

        Long teamId = getCurrentTeamId();

        return teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Team not found"
                        )
                );
    }

    public TeamMembership getCurrentMembership() {
        Long teamId = getCurrentTeamId();

        return currentPlayerService.getMembership(teamId);
    }


}