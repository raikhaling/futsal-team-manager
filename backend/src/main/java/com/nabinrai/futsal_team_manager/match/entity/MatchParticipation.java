package com.nabinrai.futsal_team_manager.match.entity;

import com.nabinrai.futsal_team_manager.common.enity.BaseEntity;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
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
        name = "match_participation",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_match_player",
                columnNames = {"match_id", "player_id"}
        )
)
public class MatchParticipation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status;
}