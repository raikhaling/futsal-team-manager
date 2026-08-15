package com.nabinrai.futsal_team_manager.auth.controller;

import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.player.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PlayerRegisterController {
    private final PlayerService playerService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerPlayer(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse registerResponse = playerService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registerResponse);
    }
}
