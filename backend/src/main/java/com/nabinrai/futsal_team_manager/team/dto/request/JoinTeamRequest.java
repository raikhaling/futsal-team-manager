package com.nabinrai.futsal_team_manager.team.dto.request;

import jakarta.validation.constraints.NotBlank;

public record JoinTeamRequest(
        @NotBlank
        String joinCode
) {
}