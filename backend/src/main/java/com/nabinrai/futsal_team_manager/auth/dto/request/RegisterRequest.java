package com.nabinrai.futsal_team_manager.auth.dto.request;


import com.nabinrai.futsal_team_manager.common.enums.Position;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        @Email
        @Size(max = 100)
        String email,

        @NotBlank
        @Size(min = 8, max = 100)
        String password,

        @Size(max = 20)
        String phone,

        @NotNull
        Position preferredPosition,

        Integer jerseyNumber
){

}