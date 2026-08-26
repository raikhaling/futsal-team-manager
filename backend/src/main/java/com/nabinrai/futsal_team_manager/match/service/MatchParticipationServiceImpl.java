package com.nabinrai.futsal_team_manager.match.service;

import com.nabinrai.futsal_team_manager.common.exception.ResourceNotFoundException;
import com.nabinrai.futsal_team_manager.common.service.CurrentPlayerService;
import com.nabinrai.futsal_team_manager.common.service.TeamContextService;
import com.nabinrai.futsal_team_manager.config.MatchProperties;
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
import com.nabinrai.futsal_team_manager.team.repository.TeamMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final MatchProperties matchProperties;
    private final TeamContextService teamContextService;
    private final TeamMembershipRepository membershipRepository;
    private final CurrentPlayerService currentPlayerService;

    @Override
    @Transactional
    public ParticipationResponse addPlayerToMatch(
            Long matchId,
            Long playerId
    ) {
        Long teamId = teamContextService.getCurrentTeamId();

        Match match = matchRepository
                .findByIdAndTeamIdForUpdate(matchId, teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found"
                        )
                );

        if (!membershipRepository.existsByTeamIdAndPlayerId(
                teamId,
                playerId
        )) {
            throw new IllegalArgumentException(
                    "Player does not belong to this team"
            );
        }

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
                confirmedCount < matchProperties.maxConfirmedPlayers()
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
        Long teamId = teamContextService.getCurrentTeamId();

        MatchParticipation participation =
                participationRepository
                        .findByIdAndMatchTeamId(
                                participationId,
                                teamId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Participation not found"
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
    @Transactional(readOnly = true)
    public List<ParticipationResponse> getMatchParticipants(
            Long matchId
    ) {
        Long teamId = teamContextService.getCurrentTeamId();

        if (!matchRepository.existsByIdAndTeamId(matchId, teamId)) {
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
    @Transactional(readOnly = true)
    public List<ParticipationResponse> getMatchParticipantsForPlayer(Long matchId) {
        Long teamId = teamContextService.getCurrentTeamId();
        Long playerId = currentPlayerService.getCurrentPlayerId();

        if (!matchRepository.existsByIdAndTeamId(matchId, teamId)) {
            throw new ResourceNotFoundException(
                    "Match not found"
            );
        }

        // Security: only players who have joined the match may see who else
        boolean isParticipant = participationRepository
                .findByMatchIdAndPlayerId(matchId, playerId)
                .isPresent();

        if (!isParticipant) {
            throw new IllegalArgumentException(
                    "You are not participating in this match"
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
    public void leaveMatch(Long matchId) {

        Long teamId = teamContextService.getCurrentTeamId();
        Long playerId = currentPlayerService.getCurrentPlayerId();

        // Verify the match belongs to the current team.
        if (!matchRepository.existsByIdAndTeamId(
                matchId,
                teamId
        )) {
            throw new ResourceNotFoundException(
                    "Match not found"
            );
        }

        MatchParticipation participation =
                participationRepository
                        .findByMatchIdAndPlayerId(
                                matchId,
                                playerId
                        )
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

        if (participation.getStatus()
                == ParticipationStatus.ATTENDED) {
            throw new IllegalArgumentException(
                    "Cannot leave a match that has already been attended"
            );
        }

        participation.setStatus(
                ParticipationStatus.CANCELLED
        );

        participationRepository.save(participation);

        long confirmedCount =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.CONFIRMED
                );

        if (confirmedCount < matchProperties.maxConfirmedPlayers()) {

            participationRepository
                    .findFirstByMatchIdAndStatusOrderByCreatedAtAsc(
                            matchId,
                            ParticipationStatus.WAITING_LIST
                    )
                    .ifPresent(waitingPlayer -> {

                        waitingPlayer.setStatus(
                                ParticipationStatus.CONFIRMED
                        );

                        participationRepository.save(
                                waitingPlayer
                        );
                    });
        }
    }

    @Override
    @Transactional
    public ParticipationResponse markNoShow(Long participationId) {
        Long teamId = teamContextService.getCurrentTeamId();

        MatchParticipation participation = getParticipation(participationId, teamId);

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

    private MatchParticipation getParticipation(Long participationId, Long teamId) {
        MatchParticipation participation =
                participationRepository
                        .findByIdAndMatchTeamId(
                                participationId,
                                teamId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Participation not found"
                                )
                        );
        return participation;
    }

    @Override
    @Transactional(readOnly = true)
    public PlayerMatchParticipationResponse getMyParticipation(
            Long matchId) {
        Long teamId = teamContextService.getCurrentTeamId();
        Long playerId = currentPlayerService.getCurrentPlayerId();
        if (!matchRepository.existsByIdAndTeamId(
                matchId,
                teamId
        )) {
            throw new ResourceNotFoundException(
                    "Match not found"
            );
        }

        return participationRepository
                .findByMatchIdAndPlayerId(
                        matchId,
                        playerId
                )
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

    @Override
    @Transactional
    public ParticipationResponse joinMatch(Long matchId) {

        Long teamId = teamContextService.getCurrentTeamId();
        Long playerId = currentPlayerService.getCurrentPlayerId();

        Match match = matchRepository
                .findByIdAndTeamIdForUpdate(matchId, teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found"
                        )
                );

        // The current player must belong to the selected team.
        // TeamContextService already verifies this.

        if (match.hasEnded()) {
            throw new IllegalArgumentException(
                    "Cannot join a match that has already ended"
            );
        }

        Player player = currentPlayerService.getCurrentPlayer();

        Optional<MatchParticipation> existingParticipation =
                participationRepository
                        .findByMatchIdAndPlayerId(
                                matchId,
                                playerId
                        );

        long confirmedCount =
                participationRepository.countByMatchIdAndStatus(
                        matchId,
                        ParticipationStatus.CONFIRMED
                );

        ParticipationStatus newStatus =
                confirmedCount < matchProperties.maxConfirmedPlayers()
                        ? ParticipationStatus.CONFIRMED
                        : ParticipationStatus.WAITING_LIST;

        if (existingParticipation.isPresent()) {

            MatchParticipation participation =
                    existingParticipation.get();

            if (participation.getStatus()
                    == ParticipationStatus.CANCELLED) {

                participation.setStatus(newStatus);

                return participationMapper.toResponse(
                        participationRepository.save(participation)
                );
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

        return participationMapper.toResponse(
                participationRepository.save(participation)
        );
    }
}