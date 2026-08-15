package com.nabinrai.futsal_team_manager.player.service;

import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.common.enums.Role;
import com.nabinrai.futsal_team_manager.common.exception.EmailAlreadyExistsException;
import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.player.dto.request.ChangePasswordRequest;
import com.nabinrai.futsal_team_manager.player.dto.request.UpdatePlayerRequest;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.mapper.PlayerMapper;
import com.nabinrai.futsal_team_manager.player.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest registerRequest) {
        if (playerRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new EmailAlreadyExistsException(
                    "Email already registered: " + registerRequest.email()
            );
        }
        Player player = playerMapper.toEntity(registerRequest);
        player.setPassword(passwordEncoder.encode(registerRequest.password()));
        player.setRole(Role.PLAYER);
        player.setEnabled(true);
        Player savedPlayer = playerRepository.save(player);
        return playerMapper.toRegisterResponse(savedPlayer);
    }

    @Override
    public UserResponse updateProfile(Long playerId, UpdatePlayerRequest request) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + playerId
                        )
                );

        player.setName(request.name());
        player.setPhone(request.phone());
        player.setPreferredPosition(request.preferredPosition());
        player.setJerseyNumber(request.jerseyNumber());

        Player updatedPlayer = playerRepository.save(player);

        return playerMapper.toUserResponse(updatedPlayer);
    }

    @Override
    public void changePassword(
            Long playerId,
            ChangePasswordRequest request
    ) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + playerId
                        )
                );

        if (!passwordEncoder.matches(
                request.currentPassword(),
                player.getPassword()
        )) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        player.setPassword(
                passwordEncoder.encode(request.newPassword())
        );

        playerRepository.save(player);
    }

    @Override
    public Page<UserResponse> getAllPlayers(Pageable pageable) {
        return playerRepository.findAll(pageable)
                .map(playerMapper::toUserResponse);
    }

    @Override
    public UserResponse getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + id
                        )
                );

        return playerMapper.toUserResponse(player);
    }

    @Override
    public void deletePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + id
                        )
                );

        playerRepository.delete(player);
    }
}
