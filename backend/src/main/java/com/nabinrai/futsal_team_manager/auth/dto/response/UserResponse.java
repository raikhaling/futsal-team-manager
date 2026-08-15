package com.nabinrai.futsal_team_manager.auth.dto.response;

import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        Position preferredPosition,
        Integer jerseyNumber,
        Role role
) {
}
