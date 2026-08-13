package com.nabinrai.futsal_team_manager.match.dto.response;

public record AttendanceSummaryResponse(
        long totalMatches,
        long attended,
        long missed,
        double attendancePercentage
) {
}