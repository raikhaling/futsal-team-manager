package com.nabinrai.futsal_team_manager.auth.dto.response;

import com.nabinrai.futsal_team_manager.common.enums.SystemRole;

public record RegisterResponse(
        Long id,

        String name,

        String email,

        SystemRole systemRole
) {
}
