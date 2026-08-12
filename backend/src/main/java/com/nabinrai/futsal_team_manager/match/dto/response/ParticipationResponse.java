package com.nabinrai.futsal_team_manager.match.dto.response;

import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;

public record ParticipationResponse(
        Long id,
        Long matchId,
        Long playerId,
        String playerName,
        ParticipationStatus status
) {
}