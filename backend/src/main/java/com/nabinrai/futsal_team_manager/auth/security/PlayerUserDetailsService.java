package com.nabinrai.futsal_team_manager.auth.security;

import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlayerUserDetailsService implements UserDetailsService {
    private final PlayerRepository playerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Player player = playerRepository
                .findByEmail(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + username
                        )
                );
        return PlayerUserDetails.from(player);
    }
}
