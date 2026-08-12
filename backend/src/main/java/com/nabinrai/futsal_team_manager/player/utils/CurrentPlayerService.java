package com.nabinrai.futsal_team_manager.player.utils;

import com.nabinrai.futsal_team_manager.auth.security.PlayerUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentPlayerService {

    public Long getCurrentPlayerId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        PlayerUserDetails userDetails =
                (PlayerUserDetails) authentication.getPrincipal();

        return userDetails.getPlayer().getId();
    }
}