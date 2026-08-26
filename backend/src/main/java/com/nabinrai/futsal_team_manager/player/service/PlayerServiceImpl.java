package com.nabinrai.futsal_team_manager.player.service;

import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;
import com.nabinrai.futsal_team_manager.common.exception.EmailAlreadyExistsException;
import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import com.nabinrai.futsal_team_manager.player.dto.request.AdminUpdatePlayerRequest;
import com.nabinrai.futsal_team_manager.player.dto.request.ChangePasswordRequest;
import com.nabinrai.futsal_team_manager.player.dto.request.UpdatePlayerRequest;
import com.nabinrai.futsal_team_manager.player.dto.response.PlayerOptionResponse;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.mapper.PlayerMapper;
import com.nabinrai.futsal_team_manager.player.repository.PlayerRepository;
import com.nabinrai.futsal_team_manager.team.repository.TeamMembershipRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;
    private final MatchParticipationRepository matchParticipationRepository;
    private final PlayerMapper playerMapper;
    private final PasswordEncoder passwordEncoder;
    private final TeamMembershipRepository teamMembershipRepository;

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
        player.setSystemRole(SystemRole.USER);
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

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return playerRepository.findAll(sortedPageable)
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
    @Transactional
    public void deletePlayer(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + id
                        )
                );
        if (SystemRole.SYSTEM_ADMIN.equals(player.getSystemRole())) {
            throw new IllegalArgumentException("Cannot delete an Admin player");
        }
        matchParticipationRepository.deleteByPlayerId(id);
        teamMembershipRepository.deleteByPlayerId(id);
        playerRepository.delete(player);

    }

    @Override
    public UserResponse updatePlayer(Long id, AdminUpdatePlayerRequest request) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Player not found with id: " + id
                ));

        if (!player.getEmail().equals(request.email())
                && playerRepository.existsByEmail(request.email())) {

            throw new IllegalArgumentException("Email is already in use");
        }
        player.setName(request.name());
        player.setEmail(request.email());
        player.setPhone(request.phone());
        player.setPreferredPosition(request.preferredPosition());
        player.setJerseyNumber(request.jerseyNumber());
        player.setSystemRole(request.systemRole());

        playerRepository.save(player);
        return playerMapper.toUserResponse(player);
    }

    @Override
    public List<PlayerOptionResponse> getPlayerOptions() {
        return playerRepository.findAll(
                        Sort.by(Sort.Direction.ASC, "name")
                )
                .stream()
                .map(player -> new PlayerOptionResponse(
                        player.getId(),
                        player.getName()
                ))
                .toList();
    }
}
