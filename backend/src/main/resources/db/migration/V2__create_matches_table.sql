CREATE TABLE matches
(
    id         BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    name       VARCHAR(255),
    location   VARCHAR(255),

    match_date DATE,
    start_time TIME,
    end_time   TIME
);