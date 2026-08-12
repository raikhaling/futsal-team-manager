package com.nabinrai.futsal_team_manager.player.controller;

import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.player.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/players")
@RequiredArgsConstructor
public class AdminPlayerController {

    private final PlayerService playerService;

    @GetMapping
    public Page<UserResponse> getAllPlayers(Pageable pageable) {
        return playerService.getAllPlayers(pageable);
    }

    @GetMapping("/{id}")
    public UserResponse getPlayer(@PathVariable Long id) {
        return playerService.getPlayerById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }
}