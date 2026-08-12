package com.nabinrai.futsal_team_manager.leaderboard.service;

import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardResponse;

import java.util.List;

public interface AttendanceLeaderboardService {

    List<AttendanceLeaderboardResponse> getLeaderboard(
            String sort
    );
}