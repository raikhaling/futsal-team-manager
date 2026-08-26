package com.nabinrai.futsal_team_manager.player.controller;

import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.common.service.CurrentPlayerService;
import com.nabinrai.futsal_team_manager.player.dto.request.ChangePasswordRequest;
import com.nabinrai.futsal_team_manager.player.dto.request.UpdatePlayerRequest;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.mapper.PlayerMapper;
import com.nabinrai.futsal_team_manager.player.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/player")
@RequiredArgsConstructor
public class PlayerController {
    private final PlayerMapper playerMapper;
    private final PlayerService playerService;
    private final CurrentPlayerService currentPlayerService;

    @GetMapping("/me")
    public UserResponse getCurrentPlayer(Authentication authentication) {

        Player player = currentPlayerService.getCurrentPlayer();

        return playerMapper.toUserResponse(player);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentPlayer(
            Authentication authentication,
            @Valid @RequestBody UpdatePlayerRequest request
    ) {
        Long currentPlayerID = currentPlayerService.getCurrentPlayerId();

        return playerService.updateProfile(
                currentPlayerID,
                request
        );
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        Long currentPlayerID = currentPlayerService.getCurrentPlayerId();

        playerService.changePassword(
                currentPlayerID,
                request
        );

        return ResponseEntity.noContent().build();
    }
}
