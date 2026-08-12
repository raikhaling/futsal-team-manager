package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.match.dto.response.ParticipationResponse;
import com.nabinrai.futsal_team_manager.match.dto.response.PlayerMatchParticipationResponse;
import com.nabinrai.futsal_team_manager.match.entity.Match;
import com.nabinrai.futsal_team_manager.match.entity.MatchParticipation;
import com.nabinrai.futsal_team_manager.match.enums.ParticipationStatus;
import com.nabinrai.futsal_team_manager.match.enums.PlayerMatchStatus;
import com.nabinrai.futsal_team_manager.match.mapper.MatchParticipationMapper;
import com.nabinrai.futsal_team_manager.match.repository.MatchParticipationRepository;
import com.nabinrai.futsal_team_manager.match.repository.MatchRepository;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import com.nabinrai.futsal_team_manager.player.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchParticipationServiceImpl
        implements MatchParticipationService {

    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final MatchParticipationRepository participationRepository;
    private final MatchParticipationMapper participationMapper;

    @Override
    public ParticipationResponse addPlayerToMatch(
            Long matchId,
            Long playerId
    ) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found with id: " + matchId
                        )
                );

        if (match.hasEnded()) {
            throw new IllegalArgumentException(
                    "Cannot join a match that has already ended"
            );
        }

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Player not found with id: " + playerId
                        )
                );

        Optional<MatchParticipation> existingParticipation =
                participationRepository.findByMatchIdAndPlayerId(
                        matchId,
                        playerId
                );

        long confirmedCount =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.CONFIRMED
                );

        ParticipationStatus newStatus =
                confirmedCount < 14
                        ? ParticipationStatus.CONFIRMED
                        : ParticipationStatus.WAITING_LIST;

        if (existingParticipation.isPresent()) {

            MatchParticipation participation =
                    existingParticipation.get();

            if (participation.getStatus() == ParticipationStatus.CANCELLED) {

                participation.setStatus(newStatus);

                MatchParticipation saved =
                        participationRepository.save(participation);

                return participationMapper.toResponse(saved);
            }

            throw new IllegalArgumentException(
                    "Player is already participating in this match"
            );
        }

        MatchParticipation participation =
                MatchParticipation.builder()
                        .match(match)
                        .player(player)
                        .status(newStatus)
                        .build();

        MatchParticipation saved =
                participationRepository.save(participation);

        return participationMapper.toResponse(saved);
    }

    @Transactional
    @Override
    public ParticipationResponse markAttendance(
            Long participationId
    ) {

        MatchParticipation participation =
                participationRepository.findById(participationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Participation not found with id: "
                                                + participationId
                                )
                        );
        if (!participation.getMatch().hasStarted()) {
            throw new IllegalArgumentException(
                    "Cannot mark attendance before the match has started"
            );
        }

        if (participation.getStatus() == ParticipationStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Cancelled participation cannot be marked as attended"
            );
        }
        if (participation.getStatus() != ParticipationStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only confirmed players can be marked as attended"
            );
        }

        participation.setStatus(ParticipationStatus.ATTENDED);

        return participationMapper.toResponse(
                participationRepository.save(participation)
        );
    }

    @Override
    public List<ParticipationResponse> getMatchParticipants(
            Long matchId
    ) {

        if (!matchRepository.existsById(matchId)) {
            throw new ResourceNotFoundException(
                    "Match not found with id: " + matchId
            );
        }

        return participationRepository
                .findByMatchId(matchId)
                .stream()
                .map(participationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void leaveMatch(Long matchId, Long playerId) {

        MatchParticipation participation =
                participationRepository
                        .findByMatchIdAndPlayerId(matchId, playerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Player is not participating in this match"
                                )
                        );
        if (participation.getMatch().hasEnded()) {
            throw new IllegalArgumentException(
                    "Cannot leave a match that has already ended"
            );
        }

        if (participation.getStatus() == ParticipationStatus.ATTENDED) {
            throw new IllegalArgumentException(
                    "Cannot leave a match that has already been attended"
            );
        }

        // Player leaves
        participation.setStatus(ParticipationStatus.CANCELLED);

        participationRepository.save(participation);

        // Promote a waiting list player to confirmed if available
        long confirmedCount =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.CONFIRMED
                );

        if (confirmedCount < 14) {

            participationRepository
                    .findFirstByMatchIdAndStatusOrderByCreatedAtAsc(
                            matchId,
                            ParticipationStatus.WAITING_LIST
                    )
                    .ifPresent(waitingPlayer -> {

                        waitingPlayer.setStatus(
                                ParticipationStatus.CONFIRMED
                        );

                        participationRepository.save(waitingPlayer);
                    });
        }
    }

    @Override
    @Transactional
    public ParticipationResponse markNoShow(Long participationId) {

        MatchParticipation participation =
                participationRepository.findById(participationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Participation not found with id: "
                                                + participationId
                                )
                        );

        Match match = participation.getMatch();

        if (!match.hasEnded()) {
            throw new IllegalArgumentException(
                    "Cannot mark a player as no-show before the match has ended"
            );
        }

        if (participation.getStatus() != ParticipationStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only confirmed players can be marked as no-show"
            );
        }

        participation.setStatus(ParticipationStatus.NO_SHOW);

        return participationMapper.toResponse(
                participationRepository.save(participation)
        );
    }

    @Override
    public PlayerMatchParticipationResponse getMyParticipation(
            Long matchId,
            Long playerId) {

        if (!matchRepository.existsById(matchId)) {
            throw new ResourceNotFoundException(
                    "Match not found with id: " + matchId
            );
        }

        return participationRepository
                .findByMatchIdAndPlayerId(matchId, playerId)
                .map(participation ->
                        new PlayerMatchParticipationResponse(
                                matchId,
                                PlayerMatchStatus.valueOf(
                                        participation.getStatus().name()
                                )
                        )
                )
                .orElseGet(() ->
                        new PlayerMatchParticipationResponse(
                                matchId,
                                PlayerMatchStatus.NOT_JOINED
                        )
                );
    }


}