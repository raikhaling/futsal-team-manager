package com.nabinrai.futsal_team_manager.player.controller;

import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.auth.security.PlayerUserDetails;
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

    @GetMapping("/me")
    public UserResponse getCurrentPlayer(Authentication authentication) {

        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        Player player = userDetails.getPlayer();

        return playerMapper.toUserResponse(player);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentPlayer(
            Authentication authentication,
            @Valid @RequestBody UpdatePlayerRequest request
    ) {
        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        return playerService.updateProfile(
                userDetails.getPlayer().getId(),
                request
        );
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        playerService.changePassword(
                userDetails.getPlayer().getId(),
                request
        );

        return ResponseEntity.noContent().build();
    }
}
