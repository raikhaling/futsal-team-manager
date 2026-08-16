package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.match.dto.request.AdminUpdateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.request.CreateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchDetailsResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.UpcomingMatchResponse;

import java.util.List;

public interface MatchService {

    MatchResponse createMatch(CreateMatchRequest request);

    List<MatchResponse> getAllMatches();

    List<UpcomingMatchResponse> getUpcomingMatches();

    MatchDetailsResponse getMatchDetails(Long matchId);

    MatchResponse updateMatch(Long id, AdminUpdateMatchRequest request);

}