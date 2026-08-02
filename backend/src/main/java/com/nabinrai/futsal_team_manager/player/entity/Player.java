package com.nabinrai.futsal_team_manager.player.entity;

import com.nabinrai.futsal_team_manager.common.enity.BaseEntity;
import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.Role;
import jakarta.persistence.*;

@Entity
@Table (name="players")
public class Player extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "preferredPosition")
    private Position preferredPosition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "jerseyNumber")
    private Integer jerseyNumber;
}
