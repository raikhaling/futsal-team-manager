package com.nabinrai.futsal_team_manager.match.mapper;

import com.nabinrai.futsal_team_manager.match.dto.request.CreateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.UpcomingMatchResponse;
import com.nabinrai.futsal_team_manager.match.entity.Match;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MatchMapper {

    Match toEntity(CreateMatchRequest request);

    MatchResponse toResponse(Match match);

    UpcomingMatchResponse toUpcomingMatchResponse(Match match);
}