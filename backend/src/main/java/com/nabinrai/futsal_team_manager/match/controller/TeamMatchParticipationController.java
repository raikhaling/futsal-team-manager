package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.request.AddParticipantRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchParticipationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams/matches")
@RequiredArgsConstructor
public class TeamMatchParticipationController {

    private final MatchParticipationService participationService;

    @PostMapping("/{matchId}/participants")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ResponseEntity<ParticipationResponse> addPlayer(
            @PathVariable Long matchId,
            @Valid @RequestBody AddParticipantRequest request
    ) {

        ParticipationResponse response =
                participationService.addPlayerToMatch(
                        matchId,
                        request.playerId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PatchMapping("/participants/{participationId}/attendance")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ParticipationResponse markAttendance(
            @PathVariable Long participationId
    ) {

        return participationService.markAttendance(
                participationId
        );
    }

    @GetMapping("/{matchId}/participants")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public List<ParticipationResponse> getParticipants(
            @PathVariable Long matchId
    ) {

        return participationService.getMatchParticipants(matchId);
    }

    @PatchMapping("/participants/{participationId}/no-show")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ParticipationResponse markNoShow(
            @PathVariable Long participationId
    ) {

        return participationService.markNoShow(
                participationId
        );
    }
}