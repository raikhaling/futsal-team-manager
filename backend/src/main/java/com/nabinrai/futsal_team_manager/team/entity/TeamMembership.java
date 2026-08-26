package com.nabinrai.futsal_team_manager.team.entity;

import com.nabinrai.futsal_team_manager.common.enity.BaseEntity;
import com.nabinrai.futsal_team_manager.common.enums.TeamRole;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "team_memberships",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_membership_player",
                columnNames = {"team_id", "player_id"}
        )
)
public class TeamMembership extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamRole role;
}