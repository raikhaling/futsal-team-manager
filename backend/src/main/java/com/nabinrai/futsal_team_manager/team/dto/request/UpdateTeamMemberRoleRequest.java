package com.nabinrai.futsal_team_manager.team.dto.request;

import com.nabinrai.futsal_team_manager.common.enums.TeamRole;
import jakarta.validation.constraints.NotNull;

public record UpdateTeamMemberRoleRequest(
        @NotNull
        TeamRole role
) {
}
