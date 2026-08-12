package com.nabinrai.futsal_team_manager.auth.security;

import com.nabinrai.futsal_team_manager.auth.dto.request.LoginRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@RequiredArgsConstructor
public class JsonAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginRequest loginRequest;
        try {
            loginRequest = objectMapper.readValue(
                    request.getInputStream(),
                    LoginRequest.class
            );
        } catch (IOException e) {
            throw new AuthenticationServiceException(
                    "Invalid login request", e
            );
        }
        UsernamePasswordAuthenticationToken authRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(
                        loginRequest.email(),
                        loginRequest.password()
                );
        return this.getAuthenticationManager().authenticate(authRequest);
    }
}
