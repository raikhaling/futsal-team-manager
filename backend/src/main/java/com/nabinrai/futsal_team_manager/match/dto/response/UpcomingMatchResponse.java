package com.nabinrai.futsal_team_manager.match.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record UpcomingMatchResponse(
        Long id,
        String name,
        String location,
        LocalDate matchDate,
        LocalTime startTime,
        LocalTime endTime
) {
}