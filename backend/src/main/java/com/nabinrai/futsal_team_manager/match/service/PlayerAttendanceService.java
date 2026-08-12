package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceHistoryResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceSummaryResponse;

import java.util.List;

public interface PlayerAttendanceService {

    AttendanceSummaryResponse getMyAttendance();

    List<AttendanceHistoryResponse> getMyAttendanceHistory();
}