CREATE TABLE match_participation
(
    id         BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP   NOT NULL,
    updated_at TIMESTAMP,

    match_id   BIGINT      NOT NULL,
    player_id  BIGINT      NOT NULL,

    status     VARCHAR(50) NOT NULL,

    CONSTRAINT fk_match_participation_match
        FOREIGN KEY (match_id)
            REFERENCES matches (id),

    CONSTRAINT fk_match_participation_player
        FOREIGN KEY (player_id)
            REFERENCES players (id),

    CONSTRAINT uk_match_player
        UNIQUE (match_id, player_id)
);