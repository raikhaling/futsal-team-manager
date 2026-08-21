package com.nabinrai.futsal_team_manager.match.repository;

import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

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

    long countByMatchIdAndStatus(Long matchId, ParticipationStatus participationStatus);

    Optional<MatchParticipation> findFirstByMatchIdAndStatusOrderByCreatedAtAsc(
            Long matchId,
            ParticipationStatus status
    );

    void deleteByPlayerId(Long id);
}