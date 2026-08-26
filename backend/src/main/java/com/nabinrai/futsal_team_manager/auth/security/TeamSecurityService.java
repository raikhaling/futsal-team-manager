package com.nabinrai.futsal_team_manager.auth.security;

import com.nabinrai.futsal_team_manager.common.enums.TeamRole;
import com.nabinrai.futsal_team_manager.common.service.CurrentPlayerService;
import com.nabinrai.futsal_team_manager.common.service.TeamContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamSecurityService {
    private final TeamContextService teamContextService;
    private final CurrentPlayerService currentPlayerService;

    public boolean isCurrentTeamAdmin() {

        if (currentPlayerService.isSystemAdmin()) {
            return true;
        }

        return teamContextService
                .getCurrentMembership()
                .getRole() == TeamRole.TEAM_ADMIN;
    }
}