package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.PlayerMatchParticipationResponse;

import java.util.List;

public interface MatchParticipationService {

    ParticipationResponse addPlayerToMatch(
            Long matchId,
            Long playerId
    );

    ParticipationResponse markAttendance(
            Long participationId
    );

    List<ParticipationResponse> getMatchParticipants(
            Long matchId
    );

    List<ParticipationResponse> getMatchParticipantsForPlayer(Long matchId);

    void leaveMatch(Long matchId);

    ParticipationResponse markNoShow(Long participationId);

    PlayerMatchParticipationResponse getMyParticipation(Long matchId);

    ParticipationResponse joinMatch(Long matchId);
}