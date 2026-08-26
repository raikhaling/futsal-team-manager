CREATE TABLE players
(
    id                 BIGSERIAL PRIMARY KEY,
    created_at         TIMESTAMP    NOT NULL,
    updated_at         TIMESTAMP,

    name               VARCHAR(100) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    password           VARCHAR(255) NOT NULL,
    phone              VARCHAR(20),

    preferred_position VARCHAR(50)  NOT NULL,
    systemRole         VARCHAR(50)  NOT NULL,

    enabled            BOOLEAN      NOT NULL DEFAULT TRUE,
    jersey_number      INTEGER
);