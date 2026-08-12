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
public class MatchParticipation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Player player;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipationStatus status;
}