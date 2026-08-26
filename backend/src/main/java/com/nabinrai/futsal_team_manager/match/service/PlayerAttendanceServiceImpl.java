package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.common.service.CurrentPlayerService;
import com.nabinrai.futsal_team_manager.common.service.TeamContextService;
import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceHistoryResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceSummaryResponse;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import com.nabinrai.futsal_team_manager.match.mapper.MatchParticipationMapper;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerAttendanceServiceImpl
        implements PlayerAttendanceService {

    private final MatchParticipationRepository participationRepository;
    private final MatchParticipationMapper participationMapper;
    private final CurrentPlayerService currentPlayerService;
    private final TeamContextService teamContextService;

    @Override
    public AttendanceSummaryResponse getMyAttendance() {

        Long playerId = currentPlayerService.getCurrentPlayerId();
        Long teamId = teamContextService.getCurrentTeamId();

        List<MatchParticipation> participations =
                participationRepository
                        .findByPlayerIdAndMatchTeamIdOrderByMatchMatchDateDesc(playerId, teamId);

        long attended = participations.stream()
                .filter(p -> p.getStatus() == ParticipationStatus.ATTENDED)
                .count();

        long noShow = participations.stream()
                .filter(p -> p.getStatus() == ParticipationStatus.NO_SHOW)
                .count();

        long totalMatches = attended + noShow;

        double attendancePercentage = totalMatches == 0
                ? 0.0
                : (attended * 100.0) / totalMatches;

        return new AttendanceSummaryResponse(
                totalMatches,
                attended,
                noShow,
                attendancePercentage
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceHistoryResponse> getMyAttendanceHistory() {
        Long playerId = currentPlayerService.getCurrentPlayerId();
        Long teamId = teamContextService.getCurrentTeamId();

        return participationRepository
                .findByPlayerIdAndMatchTeamIdOrderByMatchMatchDateDesc(playerId, teamId)
                .stream()
                .map(participationMapper::toAttendanceHistory)
                .toList();
    }

}