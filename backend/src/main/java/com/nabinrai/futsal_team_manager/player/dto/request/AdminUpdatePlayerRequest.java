package com.nabinrai.futsal_team_manager.player.dto.request;

import com.nabinrai.futsal_team_manager.common.enums.Position;
import com.nabinrai.futsal_team_manager.common.enums.SystemRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminUpdatePlayerRequest(

        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Email
        @Size(max = 100)
        String email,

        @Size(max = 20)
        String phone,

        @NotNull
        Position preferredPosition,

        @NotNull
        SystemRole systemRole,

        Integer jerseyNumber
) {
}