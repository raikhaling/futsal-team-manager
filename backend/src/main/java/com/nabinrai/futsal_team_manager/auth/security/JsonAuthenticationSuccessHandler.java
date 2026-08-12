package com.nabinrai.futsal_team_manager.auth.security;

import com.nabinrai.futsal_team_manager.auth.dto.response.LoginResponse;
import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.mapper.PlayerMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JsonAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final ObjectMapper objectMapper;
    private final PlayerMapper playerMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();
        Player player = userDetails.getPlayer();
        UserResponse userResponse = playerMapper.toUserResponse(player);
        LoginResponse loginResponse = new LoginResponse("Login successful", userResponse);
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        objectMapper.writeValue(response.getWriter(), loginResponse);
    }
}
