package com.nabinrai.futsal_team_manager.match.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record MatchDetailsResponse(
        Long id,
        LocalDate matchDate,
        LocalTime startTime,
        LocalTime endTime,
        long confirmedPlayers,
        long waitingPlayers
) {
}