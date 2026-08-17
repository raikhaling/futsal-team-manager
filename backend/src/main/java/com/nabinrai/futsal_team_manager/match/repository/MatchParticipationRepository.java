package com.nabinrai.futsal_team_manager.match.repository;

import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardProjection;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MatchParticipationRepository
        extends JpaRepository<MatchParticipation, Long> {

    List<MatchParticipation> findByMatchId(Long matchId);

    List<MatchParticipation> findByPlayerIdAndStatus(
            Long playerId,
            ParticipationStatus status
    );

    List<MatchParticipation> findByPlayerIdOrderByMatchMatchDateDesc(
            Long playerId
    );

    Optional<MatchParticipation> findByMatchIdAndPlayerId(
            Long matchId,
            Long playerId
    );

    @Query("""
            SELECT new com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardProjection(
                p.name,
                COUNT(mp.id),
                SUM(CASE WHEN mp.status = com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus.ATTENDED THEN 1 ELSE 0 END),
                SUM(CASE WHEN mp.status = com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus.NO_SHOW THEN 1 ELSE 0 END)
            )
            FROM MatchParticipation mp
            JOIN mp.player p
            WHERE mp.status IN (
                com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus.ATTENDED,
                com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus.NO_SHOW
            )
            GROUP BY p.id, p.name
            """)
    List<AttendanceLeaderboardProjection> findAttendanceLeaderboard();

    long countByMatchIdAndStatus(Long matchId, ParticipationStatus participationStatus);

    Optional<MatchParticipation> findFirstByMatchIdAndStatusOrderByCreatedAtAsc(
            Long matchId,
            ParticipationStatus status
    );

    void deleteByPlayerId(Long id);
}