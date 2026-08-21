package com.nabinrai.futsal_team_manager.leaderboard.repository;

import com.nabinrai.futsal_team_manager.leaderboard.dto.response.AttendanceLeaderboardProjection;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceLeaderboardRepository
        extends JpaRepository<MatchParticipation, Long> {

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
}