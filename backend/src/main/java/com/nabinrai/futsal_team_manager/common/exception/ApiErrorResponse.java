package com.nabinrai.futsal_team_manager.common.exception;

import java.time.LocalDateTime;

public record ApiErrorResponse(

        LocalDateTime timestamp,

        int status,

        String error,

        String message,

        String path

) {
}