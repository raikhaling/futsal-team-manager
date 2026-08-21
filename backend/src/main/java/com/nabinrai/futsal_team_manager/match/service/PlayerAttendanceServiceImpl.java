package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceHistoryResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceSummaryResponse;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import com.nabinrai.futsal_team_manager.match.mapper.MatchParticipationMapper;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import com.nabinrai.futsal_team_manager.player.utils.CurrentPlayerService;

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

    @Override
    public AttendanceSummaryResponse getMyAttendance() {

        Long playerId = currentPlayerService.getCurrentPlayerId();

        List<MatchParticipation> participations =
                participationRepository
                        .findByPlayerIdOrderByMatchMatchDateDesc(playerId);

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

    //    @Override
//    public List<AttendanceHistoryResponse> getMyAttendanceHistory() {
//        Long playerId = currentPlayerService.getCurrentPlayerId();
//
//        List<MatchParticipation> participation =
//                participationRepository.findByPlayerIdOrderByMatchMatchDateDesc(playerId);
//
//        if (participation.isEmpty()) {
//            throw new ResourceNotFoundException("No attendance history found for player id: " + playerId);
//        }
//
//        return participation.stream()
//                .map(participationMapper::toAttendanceHistory)
//                .toList();
//    }


    @Override
    @Transactional(readOnly = true)
    public List<AttendanceHistoryResponse> getMyAttendanceHistory() {
        Long playerId = currentPlayerService.getCurrentPlayerId();

        return participationRepository
                .findByPlayerIdOrderByMatchMatchDateDesc(playerId)
                .stream()
                .map(participationMapper::toAttendanceHistory)
                .toList();
    }
}