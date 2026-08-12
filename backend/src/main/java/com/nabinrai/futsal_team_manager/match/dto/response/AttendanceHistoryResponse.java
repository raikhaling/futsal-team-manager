package com.nabinrai.futsal_team_manager.match.dto.response;

import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceHistoryResponse(
        Long matchId,
        LocalDate matchDate,
        LocalTime startTime,
        LocalTime endTime,
        ParticipationStatus status
) {
}