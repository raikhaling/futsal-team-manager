package com.nabinrai.futsal_team_manager.team.repository;

import com.nabinrai.futsal_team_manager.common.enums.TeamRole;
import com.nabinrai.futsal_team_manager.team.entity.TeamMembership;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMembershipRepository
        extends JpaRepository<TeamMembership, Long> {

    List<TeamMembership> findAllByPlayerId(Long playerId);

    @EntityGraph(attributePaths = {"player"})
    List<TeamMembership> findAllByTeamId(Long teamId);

    Optional<TeamMembership> findByTeamIdAndPlayerId(
            Long teamId,
            Long playerId
    );

    boolean existsByTeamIdAndPlayerId(
            Long teamId,
            Long playerId
    );

    long countByTeamIdAndRole(
            Long teamId,
            TeamRole role
    );


    void deleteByPlayerId(Long id);
}
