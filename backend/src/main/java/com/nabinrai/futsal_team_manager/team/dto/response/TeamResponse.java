package com.nabinrai.futsal_team_manager.team.dto.response;

import com.nabinrai.futsal_team_manager.common.enums.TeamRole;

public record TeamResponse(
        Long id,
        String name,
        String description,
        String joinCode,
        TeamRole role
) {
}