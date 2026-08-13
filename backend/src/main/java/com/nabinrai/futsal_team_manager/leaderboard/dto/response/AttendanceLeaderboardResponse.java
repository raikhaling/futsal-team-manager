package com.nabinrai.futsal_team_manager.leaderboard.dto.response;

public record AttendanceLeaderboardResponse(
        String playerName,
        long matches,
        long attended,
        long noShow,
        double attendancePercentage
) {
}