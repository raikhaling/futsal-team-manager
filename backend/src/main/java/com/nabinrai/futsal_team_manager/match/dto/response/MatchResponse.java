package com.nabinrai.futsal_team_manager.match.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record MatchResponse(
        Long id,
        LocalDate matchDate,
        LocalTime startTime,
        LocalTime endTime
) {
}