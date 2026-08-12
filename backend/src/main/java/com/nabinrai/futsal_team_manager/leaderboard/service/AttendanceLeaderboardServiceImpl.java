package com.nabinrai.futsal_team_manager.leaderboard.service;

import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardProjection;
import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardResponse;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceLeaderboardServiceImpl
        implements AttendanceLeaderboardService {

    private final MatchParticipationRepository participationRepository;

    @Override
    public List<AttendanceLeaderboardResponse> getLeaderboard(String sort) {

        List<AttendanceLeaderboardProjection> projections =
                participationRepository.findAttendanceLeaderboard();

        return projections.stream()
                .map(player -> {

                    double percentage =
                            player.matches() == 0
                                    ? 0.0
                                    : player.attended() * 100.0 / player.matches();

                    return new AttendanceLeaderboardResponse(
                            player.playerName(),
                            player.matches(),
                            player.attended(),
                            player.noShow(),
                            percentage
                    );
                })
                .sorted(getComparator(sort))
                .toList();
    }

    private Comparator<AttendanceLeaderboardResponse> getComparator(
            String sort
    ) {

        if ("percentage".equalsIgnoreCase(sort)) {

            return Comparator
                    .comparingDouble(
                            AttendanceLeaderboardResponse::attendancePercentage
                    )
                    .reversed()
                    .thenComparing(
                            AttendanceLeaderboardResponse::matches,
                            Comparator.reverseOrder()
                    );
        }

        // Default: sort by most games played
        return Comparator
                .comparingLong(
                        AttendanceLeaderboardResponse::matches
                )
                .reversed()
                .thenComparing(
                        AttendanceLeaderboardResponse::attendancePercentage,
                        Comparator.reverseOrder()
                );
    }
}