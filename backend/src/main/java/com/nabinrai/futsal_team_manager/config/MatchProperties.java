package com.nabinrai.futsal_team_manager.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.match")
public record MatchProperties(
        int maxConfirmedPlayers
) {

    public MatchProperties {
        if (maxConfirmedPlayers <= 0) {
            throw new IllegalArgumentException("maxConfirmedPlayers must be positive");
        }
    }
}