package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.common.service.TeamContextService;
import com.nabinrai.futsal_team_manager.match.dto.request.AdminUpdateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.request.CreateMatchRequest;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchDetailsResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.MatchResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.UpcomingMatchResponse;
import com.nabinrai.futsal_team_manager.match.entity.Match;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import com.nabinrai.futsal_team_manager.match.mapper.MatchMapper;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import com.nabinrai.futsal_team_manager.match.repository.MatchRepository;
import com.nabinrai.futsal_team_manager.team.entity.Team;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;
    private final MatchParticipationRepository participationRepository;
    private final TeamContextService teamContextService;

    @Override
    public MatchResponse createMatch(CreateMatchRequest request) {

        if (request.endTime().isBefore(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time cannot be before start time"
            );
        }

        Team team = teamContextService.getCurrentTeam();
        if (matchRepository.existsOverlappingMatch(
                team.getId(),
                request.matchDate(),
                request.startTime(),
                request.endTime()
        )) {
            throw new IllegalArgumentException(
                    "A match already exists during this time period"
            );
        }
        Match match = matchMapper.toEntity(request);

        match.setTeam(team);

        Match savedMatch = matchRepository.save(match);

        return matchMapper.toResponse(savedMatch);
    }

    @Override
    public List<MatchResponse> getAllMatches() {
        Long teamId = teamContextService.getCurrentTeamId();
        return matchRepository
                .findAllByTeamId(teamId)
                .stream()
                .sorted(Comparator
                        .comparing(Match::getMatchDate)
                        .thenComparing(Match::getStartTime))
                .map(matchMapper::toResponse)
                .toList();
    }

    @Override
    public List<UpcomingMatchResponse> getUpcomingMatches() {

        Long teamId = teamContextService.getCurrentTeamId();

        LocalDate today = LocalDate.now();

        return matchRepository
                .findByTeamIdAndMatchDateGreaterThanEqualOrderByMatchDateAscStartTimeAsc(
                        teamId,
                        today
                )
                .stream()
                .filter(match -> !match.hasEnded())
                .map(matchMapper::toUpcomingMatchResponse)
                .toList();
    }

    @Override
    public MatchDetailsResponse getMatchDetails(Long matchId) {

        Long teamId = teamContextService.getCurrentTeamId();

        Match match = matchRepository
                .findByIdAndTeamId(matchId, teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found"
                        )
                );

        long confirmedPlayers =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.CONFIRMED
                );

        long waitingPlayers =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.WAITING_LIST
                );

        return new MatchDetailsResponse(
                match.getId(),
                match.getName(),
                match.getLocation(),
                match.getMatchDate(),
                match.getStartTime(),
                match.getEndTime(),
                confirmedPlayers,
                waitingPlayers
        );
    }

    @Override
    public MatchResponse updateMatch(
            Long id,
            AdminUpdateMatchRequest request
    ) {
        Long teamId = teamContextService.getCurrentTeamId();
        Match match = matchRepository
                .findByIdAndTeamId(id, teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found with id: " + id
                        )
                );
        if (request.endTime().isBefore(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time cannot be before start time"
            );
        }
        if (matchRepository.existsOverlappingMatchForUpdate(
                teamId,
                id,
                request.matchDate(),
                request.startTime(),
                request.endTime()
        )) {
            throw new IllegalArgumentException(
                    "A match already exists during this time period"
            );
        }

        match.setName(request.name());
        match.setLocation(request.location());
        match.setMatchDate(request.matchDate());
        match.setStartTime(request.startTime());
        match.setEndTime(request.endTime());

        matchRepository.save(match);

        return matchMapper.toResponse(match);
    }


}