package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.request.CreateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/matches")
@RequiredArgsConstructor
public class AdminMatchController {

    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(
            @Valid @RequestBody CreateMatchRequest request
    ) {

        MatchResponse response = matchService.createMatch(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public List<MatchResponse> getAllMatches() {
        return matchService.getAllMatches();
    }
}