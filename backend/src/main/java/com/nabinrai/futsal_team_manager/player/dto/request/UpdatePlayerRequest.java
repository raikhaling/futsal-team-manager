package com.nabinrai.futsal_team_manager.player.dto.request;

import com.nabinrai.futsal_team_manager.common.enums.Position;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdatePlayerRequest(
        @NotBlank
        String name,

        String phone,

        @NotNull
        Position preferredPosition,

        @NotNull
        Integer jerseyNumber
) {
}
