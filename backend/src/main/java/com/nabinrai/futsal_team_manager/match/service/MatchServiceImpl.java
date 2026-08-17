package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;
    private final MatchParticipationRepository participationRepository;

    @Override
    public MatchResponse createMatch(CreateMatchRequest request) {

        if (request.endTime().isBefore(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time cannot be before start time"
            );
        }

        Match match = matchMapper.toEntity(request);

        if (matchRepository.existsOverlappingMatch(
                request.matchDate(),
                request.startTime(),
                request.endTime()
        )) {
            throw new IllegalArgumentException(
                    "A match already exists during this time period"
            );
        }

        Match savedMatch = matchRepository.save(match);

        return matchMapper.toResponse(savedMatch);
    }

    @Override
    public List<MatchResponse> getAllMatches() {

        return matchRepository
                .findAllByOrderByMatchDateAscStartTimeAsc()
                .stream()
                .map(matchMapper::toResponse)
                .toList();
    }

    @Override
    public List<UpcomingMatchResponse> getUpcomingMatches() {

        LocalDate today = LocalDate.now();

        return matchRepository
                .findByMatchDateGreaterThanEqualOrderByMatchDateAscStartTimeAsc(today)
                .stream()
                .filter(match -> !match.hasEnded())
                .map(matchMapper::toUpcomingMatchResponse)
                .toList();
    }

    @Override
    public MatchDetailsResponse getMatchDetails(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found with id: " + matchId
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
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Match not found with id: " + id
                ));

        match.setName(request.name());
        match.setLocation(request.location());
        match.setMatchDate(request.matchDate());
        match.setStartTime(request.startTime());
        match.setEndTime(request.endTime());

        matchRepository.save(match);

        return matchMapper.toResponse(match);
    }


}