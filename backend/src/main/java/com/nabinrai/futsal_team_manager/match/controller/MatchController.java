package com.nabinrai.futsal_team_manager.match.controller;

import com.nabinrai.futsal_team_manager.match.dto.response.MatchDetailsResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.UpcomingMatchResponse;
import com.nabinrai.futsal_team_manager.match.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/upcoming")
    public List<UpcomingMatchResponse> getUpcomingMatches() throws AccessDeniedException {
        return matchService.getUpcomingMatches();
    }

    @GetMapping("/{matchId}")
    public MatchDetailsResponse getMatchDetails(
            @PathVariable Long matchId
    ) {
        return matchService.getMatchDetails(matchId);
    }
}