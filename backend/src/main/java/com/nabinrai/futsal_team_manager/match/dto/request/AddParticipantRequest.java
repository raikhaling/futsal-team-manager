package com.nabinrai.futsal_team_manager.match.dto.request;

import jakarta.validation.constraints.NotNull;

public record AddParticipantRequest(
        @NotNull
        Long playerId
) {
}