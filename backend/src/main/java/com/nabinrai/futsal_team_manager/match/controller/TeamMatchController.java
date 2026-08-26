package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.request.AdminUpdateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.request.CreateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchService;
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
public class TeamMatchController {

    private final MatchService matchService;

    @PostMapping
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ResponseEntity<MatchResponse> createMatch(
            @Valid @RequestBody CreateMatchRequest request
    ) {

        MatchResponse response = matchService.createMatch(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public MatchResponse updateMatch(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateMatchRequest request
    ) {
        return matchService.updateMatch(id, request);
    }


    @GetMapping
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public List<MatchResponse> getAllMatches() {
        return matchService.getAllMatches();
    }
}