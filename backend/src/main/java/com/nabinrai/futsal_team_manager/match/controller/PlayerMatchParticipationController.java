package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.PlayerMatchParticipationResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player/matches")
@RequiredArgsConstructor
public class PlayerMatchParticipationController {

    private final MatchParticipationService participationService;

    @PostMapping("/{matchId}/participation")
    public ResponseEntity<ParticipationResponse> joinMatch(
            @PathVariable Long matchId
    ) {

        ParticipationResponse response =
                participationService.joinMatch(matchId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/{matchId}/participation")
    public ResponseEntity<Void> leaveMatch(
            @PathVariable Long matchId
    ) {

        participationService.leaveMatch(matchId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{matchId}/participation")
    public PlayerMatchParticipationResponse getMyParticipation(
            @PathVariable Long matchId
    ) {
        return participationService.getMyParticipation(matchId);
    }

    @GetMapping("/{matchId}/participants")
    public List<ParticipationResponse> getParticipants(
            @PathVariable Long matchId
    ) {
        return participationService.getMatchParticipantsForPlayer(matchId);
    }
}