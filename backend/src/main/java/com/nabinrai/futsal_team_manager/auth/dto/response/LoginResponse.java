package com.nabinrai.futsal_team_manager.auth.dto.response;

public record LoginResponse(
        String message,
        UserResponse user
) {
}