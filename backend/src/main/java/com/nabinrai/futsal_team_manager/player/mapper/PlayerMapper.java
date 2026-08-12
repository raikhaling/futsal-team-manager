package com.nabinrai.futsal_team_manager.player.mapper;

import com.nabinrai.futsal_team_manager.auth.dto.request.RegisterRequest;
import com.nabinrai.futsal_team_manager.auth.dto.response.RegisterResponse;
import com.nabinrai.futsal_team_manager.auth.dto.response.UserResponse;
import com.nabinrai.futsal_team_manager.player.entity.Player;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlayerMapper {
    Player toEntity(RegisterRequest request);

    RegisterResponse toRegisterResponse(Player player);

    UserResponse toUserResponse(Player player);
}
