package com.nabinrai.futsal_team_manager.leaderboard.controller;

import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardResponse;
import com.nabinrai.futsal_team_manager.leaderboard.service.AttendanceLeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final AttendanceLeaderboardService leaderboardService;

    @GetMapping("/attendance")
    public List<AttendanceLeaderboardResponse> getAttendanceLeaderboard(
            @RequestParam(defaultValue = "matches") String sort
    ) {

        return leaderboardService.getLeaderboard(sort);
    }
}