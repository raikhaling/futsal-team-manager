package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.PlayerMatchParticipationResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchParticipationService;
import com.nabinrai.futsal_team_manager.match.service.MatchService;
import com.nabinrai.futsal_team_manager.player.utils.CurrentPlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/player/matches")
@RequiredArgsConstructor
public class PlayerMatchController {

    private final MatchService matchService;
    private final MatchParticipationService participationService;
    private final CurrentPlayerService currentPlayerService;

    @GetMapping
    public List<MatchResponse> getMatches() {
        return matchService.getAllMatches();
    }

    @PostMapping("/{matchId}/join")
    public ResponseEntity<ParticipationResponse> joinMatch(
            @PathVariable Long matchId
    ) {

        Long playerId = currentPlayerService.getCurrentPlayerId();

        ParticipationResponse response =
                participationService.addPlayerToMatch(
                        matchId,
                        playerId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/{matchId}/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leaveMatch(@PathVariable Long matchId) {

        Long playerId = currentPlayerService.getCurrentPlayerId();

        participationService.leaveMatch(matchId, playerId);
    }

    @GetMapping("/{matchId}/participation")
    public PlayerMatchParticipationResponse getMyParticipation(
            @PathVariable Long matchId
    ) {
        return participationService.getMyParticipation(matchId, currentPlayerService.getCurrentPlayerId());
    }

}