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
    @Query("SELECT m FROM Match m WHERE m.id = :id")
    Optional<Match> findByIdForUpdate(@Param("id") Long id);

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

    List<Match> findAllByOrderByMatchDateAscStartTimeAsc();
}