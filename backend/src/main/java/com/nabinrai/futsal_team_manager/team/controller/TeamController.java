package com.nabinrai.futsal_team_manager.team.controller;

import com.nabinrai.futsal_team_manager.team.dto.request.CreateTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.JoinTeamRequest;
import com.nabinrai.futsal_team_manager.team.dto.request.UpdateTeamMemberRoleRequest;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamMemberResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamJoinCodeResponse;
import com.nabinrai.futsal_team_manager.team.dto.response.TeamResponse;
import com.nabinrai.futsal_team_manager.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @Valid @RequestBody CreateTeamRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(teamService.createTeam(request));
    }

    @PostMapping("/join")
    public TeamResponse joinTeam(
            @Valid @RequestBody JoinTeamRequest request
    ) {
        return teamService.joinTeam(request);
    }

    @GetMapping("/my")
    public List<TeamResponse> getMyTeams() {
        return teamService.getMyTeams();
    }

    @GetMapping("/current/join-code")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public TeamJoinCodeResponse getCurrentTeamJoinCode() {
        return teamService.getCurrentTeamJoinCode();
    }

    @GetMapping("/members")
    public List<TeamMemberResponse> getTeamMembers() {
        return teamService.getTeamMembers();
    }

    @DeleteMapping("/members/{playerId}")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long playerId
    ) {

        teamService.removeMember(playerId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveTeam() {
        teamService.leaveTeam();

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/members/{playerId}/role")
    @PreAuthorize("@teamSecurityService.isCurrentTeamAdmin()")
    public ResponseEntity<Void> updateMemberRole(
            @PathVariable Long playerId,
            @Valid @RequestBody UpdateTeamMemberRoleRequest request
    ) {

        teamService.updateMemberRole(playerId, request);

        return ResponseEntity.noContent().build();
    }
}