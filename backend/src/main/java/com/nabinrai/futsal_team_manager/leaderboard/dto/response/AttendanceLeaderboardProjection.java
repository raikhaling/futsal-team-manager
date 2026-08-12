package com.nabinrai.futsal_team_manager.leaderboard.dto.response;

public record AttendanceLeaderboardProjection(
        String playerName,
        long matches,
        long attended,
        long noShow
) {
}