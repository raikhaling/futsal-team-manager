package com.nabinrai.futsal_team_manager.match.repository;

import com.nabinrai.futsal_team_manager.match.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    @Query("""
                SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
                FROM Match m
                WHERE m.matchDate = :matchDate
                  AND m.startTime < :endTime
                  AND m.endTime > :startTime
            """)
    boolean existsOverlappingMatch(
            LocalDate matchDate,
            LocalTime startTime,
            LocalTime endTime
    );

    List<Match> findByMatchDateGreaterThanEqualOrderByMatchDateAscStartTimeAsc(
            LocalDate date
    );

}