package com.nabinrai.futsal_team_manager.match.mapper;

import com.nabinrai.futsal_team_manager.match.dto.response.AttendanceHistoryResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MatchParticipationMapper {

    @Mapping(source = "match.id", target = "matchId")
    @Mapping(source = "player.id", target = "playerId")
    @Mapping(source = "player.name", target = "playerName")
    ParticipationResponse toResponse(MatchParticipation participation);

    @Mapping(source = "match.id", target = "matchId")
    @Mapping(source = "match.matchDate", target = "matchDate")
    @Mapping(source = "match.startTime", target = "startTime")
    @Mapping(source = "match.endTime", target = "endTime")
    AttendanceHistoryResponse toAttendanceHistory(
            MatchParticipation participation
    );
}