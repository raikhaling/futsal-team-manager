package com.nabinrai.futsal_team_manager.auth.security;

import com.nabinrai.futsal_team_manager.player.entity.Player;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class PlayerUserDetails implements UserDetails {
    private final Player player;

    public static PlayerUserDetails from(Player player) {
        return new PlayerUserDetails(player);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + player.getRole().name()
                )
        );
    }

    @Override
    public @Nullable String getPassword() {
        return player.getPassword();
    }

    @Override
    public String getUsername() {
        return player.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return player.getEnabled();
    }

    public Player getPlayer() {
        return this.player;
    }
}
