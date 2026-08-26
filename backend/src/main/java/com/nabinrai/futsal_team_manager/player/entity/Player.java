package com.nabinrai.futsal_team_manager.player.entity;

import com.nabinrai.futsal_team_manager.common.enity.BaseEntity;
import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "players")
public class Player extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Position preferredPosition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SystemRole systemRole;

    @Column(nullable = false)
    private Boolean enabled = true;

    private Integer jerseyNumber;
}
