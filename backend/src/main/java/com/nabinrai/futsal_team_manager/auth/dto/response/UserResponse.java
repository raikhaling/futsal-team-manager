package com.nabinrai.futsal_team_manager.auth.dto.response;

import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Position preferredPosition,
        Integer jerseyNumber,
        SystemRole systemRole
) {
}
