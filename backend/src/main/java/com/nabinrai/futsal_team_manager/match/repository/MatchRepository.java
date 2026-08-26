package com.nabinrai.futsal_team_manager.match.repository;

import com.nabinrai.futsal_team_manager.match.entity.Match;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
                SELECT m
                FROM Match m
                WHERE m.id = :matchId
                  AND m.team.id = :teamId
            """)
    Optional<Match> findByIdAndTeamIdForUpdate(
            @Param("matchId") Long matchId,
            @Param("teamId") Long teamId
    );

    @Query("""
            SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
            FROM Match m
            WHERE m.team.id = :teamId
              AND m.matchDate = :matchDate
              AND m.startTime < :endTime
              AND m.endTime > :startTime
            """)
    boolean existsOverlappingMatch(
            @Param("teamId") Long teamId,
            @Param("matchDate") LocalDate matchDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
                SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
                FROM Match m
                WHERE m.team.id = :teamId
                  AND m.id <> :matchId
                  AND m.matchDate = :matchDate
                  AND m.startTime < :endTime
                  AND m.endTime > :startTime
            """)
    boolean existsOverlappingMatchForUpdate(
            Long teamId,
            Long matchId,
            LocalDate matchDate,
            LocalTime startTime,
            LocalTime endTime
    );

    List<Match> findAllByTeamId(Long teamId);

    Optional<Match> findByIdAndTeamId(Long matchId, Long teamId);

    List<Match> findByTeamIdAndMatchDateGreaterThanEqualOrderByMatchDateAscStartTimeAsc(
            Long teamId,
            LocalDate date
    );

    boolean existsByIdAndTeamId(Long matchId, Long teamId);
}