package com.nabinrai.futsal_team_manager.player.service;

import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.player.dto.request.ChangePasswordRequest;
import com.nabinrai.futsal_team_manager.player.dto.request.UpdatePlayerRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PlayerService {
    public RegisterResponse register(RegisterRequest registerRequest);

    UserResponse updateProfile(Long id, @Valid UpdatePlayerRequest request);

    void changePassword(Long id, @Valid ChangePasswordRequest request);

    Page<UserResponse> getAllPlayers(Pageable pageable);

    UserResponse getPlayerById(Long id);

    void deletePlayer(Long id);
}
