package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceHistoryResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceSummaryResponse;
import com.nabinrai.futsal_team_manager.match.service.PlayerAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/player/attendance")
@RequiredArgsConstructor
public class PlayerAttendanceController {

    private final PlayerAttendanceService attendanceService;

    @GetMapping
    public AttendanceSummaryResponse getMyAttendance() {
        return attendanceService.getMyAttendance();
    }

    @GetMapping("/history")
    public List<AttendanceHistoryResponse> getMyAttendanceHistory() {
        return attendanceService.getMyAttendanceHistory();
    }
}