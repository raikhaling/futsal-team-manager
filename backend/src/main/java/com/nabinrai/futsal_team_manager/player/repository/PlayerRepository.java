package com.nabinrai.futsal_team_manager.player.repository;

import com.nabinrai.futsal_team_manager.player.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {
}
