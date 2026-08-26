package com.nabinrai.futsal_team_manager.team.dto.response;

import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.TeamRole;

public record TeamMemberResponse(
        Long playerId,
        String name,
        String email,
        String phone,
        Integer jerseyNumber,
        Position preferredPosition,
        TeamRole role
) {
}