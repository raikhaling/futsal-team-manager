package com.nabinrai.futsal_team_manager.match.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record AdminUpdateMatchRequest(
        @NotBlank String name,
        @NotBlank String location,
        @NotNull LocalDate matchDate,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime
) {
}