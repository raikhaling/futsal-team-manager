package com.nabinrai.futsal_team_manager.auth.service;

import com.nabinrai.futsal_team_manager.auth.dto.request.LoginRequest;
import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.common.enums.Role;
import com.nabinrai.futsal_team_manager.common.exception.EmailAlreadyExistsException;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.mapper.PlayerMapper;
import com.nabinrai.futsal_team_manager.player.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (playerRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        Player player = playerMapper.toEntity(request);
        player.setPassword(passwordEncoder.encode(request.password()));
        player.setRole(Role.PLAYER);
        player.setEnabled(true);
        Player savedPlayer = playerRepository.save(player);
        return playerMapper.toRegisterResponse(savedPlayer);
    }

    public Authentication login(LoginRequest loginRequest) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password())
        );
    }

}
