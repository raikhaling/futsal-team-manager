package com.nabinrai.futsal_team_manager.match.entity;

import com.nabinrai.futsal_team_manager.common.enity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match extends BaseEntity {
    
    private String name;

    private String location;

    private LocalDate matchDate;

    private LocalTime startTime;

    private LocalTime endTime;

    public boolean hasEnded() {
        LocalDateTime endDateTime = LocalDateTime.of(
                matchDate,
                endTime
        );

        return LocalDateTime.now().isAfter(endDateTime);
    }

    public boolean hasStarted() {
        LocalDateTime startDateTime = LocalDateTime.of(
                matchDate,
                startTime
        );

        return !LocalDateTime.now().isBefore(startDateTime);
    }
}