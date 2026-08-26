package com.nabinrai.futsal_team_manager.common.service;

import com.nabinrai.futsal_team_manager.auth.security.PlayerUserDetails;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.team.entity.TeamMembership;
import com.nabinrai.futsal_team_manager.team.repository.TeamMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class CurrentPlayerService {
    private final TeamMembershipRepository teamMembershipRepository;

    public Long getCurrentPlayerId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        return userDetails.getPlayer().getId();
    }

    public Player getCurrentPlayer() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        return userDetails.getPlayer();
    }

        public boolean isSystemAdmin() {
                return getCurrentPlayer().getSystemRole() == SystemRole.SYSTEM_ADMIN;
        }

    public TeamMembership getMembership(Long teamId) {
        return teamMembershipRepository
                .findByTeamIdAndPlayerId(
                        teamId,
                        getCurrentPlayerId()
                )
                .orElseThrow(() ->

                        new AccessDeniedException(
                                "You are not a member of this team"
                        )
                );
    }

}