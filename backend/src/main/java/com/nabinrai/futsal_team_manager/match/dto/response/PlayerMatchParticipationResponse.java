package com.nabinrai.futsal_team_manager.match.dto.response;

import com.nabinrai.futsal_team_manager.match.enums.PlayerMatchStatus;

public record PlayerMatchParticipationResponse(
        Long matchId,
        PlayerMatchStatus status
) {
}